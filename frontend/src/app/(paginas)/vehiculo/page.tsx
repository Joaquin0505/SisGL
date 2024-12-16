'use client'

import { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useCreateVehiculosMutation, useGetVehiculosQuery, useGetTipovehiculoQuery, useDeleteVehiculoMutation, useUpdateVehiculoMutation, useCreateTipovehiculoMutation } from "@/state/api";
import { Header } from "@/app/(components)/Header";
import { PlusCircleIcon } from "lucide-react";
import { CreateVehicleModal } from "./CreateVehicleModal";
import { CreateTipoVehiculoModal } from "./CreateTipoVehiculoModal";
import { useAppSelector } from "@/app/redux";

type VehicleFormData = {
  vehiculoId: string;
  tipovehiculoId: string;
  tipoVehiculoNombre: string;
  nplaca: string;
  marca: string;
  modelo: string;
  color: string;
};

export default function VehiculoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehicleFormData | null>(null);
  const [searchPlaca, setSearchPlaca] = useState("");
  const { data: vehiculos, isError, isLoading } = useGetVehiculosQuery();
  const { data: tiposVehiculo } = useGetTipovehiculoQuery();   
  const [createTipoVehiculo] = useCreateTipovehiculoMutation();
  const [createVehiculo] = useCreateVehiculosMutation();
  const [deleteVehiculo] = useDeleteVehiculoMutation();
  const [updateVehiculo] = useUpdateVehiculoMutation();


  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  



  const handleCreateTipoVehiculo = async (nombre: string, tarifa: number) => {
    await createTipoVehiculo({ nombre, tarifa });
  };

  const handlerCreateVehiculo = async (productData: VehicleFormData) => {
    const vehiculoData = { ...productData, cantidad: 1 }; // Añadimos cantidad con valor 1
    if (isEditMode && selectedVehiculo) {
      await updateVehiculo({
        vehiculoId: selectedVehiculo.vehiculoId,
        data: vehiculoData,
      });
    } else {
      await createVehiculo(vehiculoData); // Pasamos el objeto con cantidad
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedVehiculo(null);
  };
  

  const handleEditVehiculo = (vehiculo: VehicleFormData) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleDeleteVehiculo = async (vehiculoId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
      await deleteVehiculo(vehiculoId);
    }
  };

  const tipoVehiculoDict = useMemo(() => {
    if (tiposVehiculo) {
      return tiposVehiculo.reduce((acc, tipo) => {
        acc[tipo.tipovehiculoId] = tipo.nombre;
        return acc;
      }, {} as Record<string, string>);
    }
    return {};
  }, [tiposVehiculo]);

  const vehiculosConNombreTipo = vehiculos?.map((vehiculo) => ({
    ...vehiculo,
    tipoVehiculoNombre: tipoVehiculoDict[vehiculo.tipovehiculoId] || "Desconocido",
  }));

  const columns: GridColDef[] = [
    { field: "nplaca", headerName: "Placa", width: 120 },
    { field: "marca", headerName: "Marca", width: 150 },
    { field: "modelo", headerName: "Modelo", width: 150 },
    { field: "color", headerName: "Color", width: 130 },
    { field: "tipoVehiculoNombre", headerName: "Tipo", width: 150 },

    {
      field: "actions",
      headerName: "Acciones",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdEdit color="#22c11a" size={25} />}
          label="Editar"
          onClick={() => handleEditVehiculo(params.row)}
        />,
        <GridActionsCellItem
          icon={<MdDeleteForever color="#c11a3f" size={25} />}
          label="Eliminar"
          onClick={() => handleDeleteVehiculo(params.row.vehiculoId)}
        />,
      ],
    },
  ];

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !vehiculosConNombreTipo) {
    return (
      <div className="text-center text-red-500 py-4">Falla en la conexión</div>
    );
  }

  const filteredVehiculos = vehiculosConNombreTipo.filter((vehiculo) =>
    vehiculo.nplaca.toLowerCase().includes(searchPlaca.toLowerCase())
  );

  return (
    <div className="flex flex-col content-center h-full justify-center items-center pt-1 xl:pt-1 px-4 mt-6 ml-3">
      <div className="flex w-full justify-center items-center mb-10 ">
        <div className="flex flex-col gap-6 bg-white  w-full rounded-2xl shadow-lg shadow-slate-500 pb-11 pt-8 px-5">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="md:text-3xl font-extrabold text-gray-800 text-3xl">
            Lista de Vehículos
          </h1>
          <div className="border-gray-500 border-2 rounded-2xl p-2 flex items-center px-3">
            <input
              type="text"
              placeholder="Buscar por placa"
              className="outline-none bg-transparent"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value)}
            />
            <FaSearch color="#146984" />
          </div>
        </div>

        <div style={{ height: 330, width: "100%"}}>
          <DataGrid
            rows={filteredVehiculos}
            columns={columns}
            getRowId={(row) => row.vehiculoId}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            className="bg-white"
            sx={{
              '& .MuiDataGrid-cell': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Dark mode text color
              },
              '& .MuiTablePagination-root': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Pagination text color
              },
              '& .MuiTablePagination-select': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Rows per page dropdown color
              },
              '& .MuiTablePagination-actions': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Arrow buttons color
              },
            }}
          />
        </div>

        <div className="flex w-full justify-start ">
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded mr-6"
          onClick={() => {
            setIsEditMode(false);
            setSelectedVehiculo(null);
            setIsModalOpen(true);
          }}
        >
          Registrar Vehículo
        </button>
      <button
        className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-72"
        onClick={() => setIsTipoModalOpen(true)}
      >
        <PlusCircleIcon className="w-5 h-5 mr-2 text-white" />
        Agregar Tipo de Vehículo
      </button>
      </div>


      </div>
      </div>

      <CreateVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handlerCreateVehiculo}
        initialData={isEditMode ? selectedVehiculo : null}
      />

      {/* Modal de creación de tipo de vehículo */}
      <CreateTipoVehiculoModal
        isOpen={isTipoModalOpen}
        onClose={() => setIsTipoModalOpen(false)}
        onCreate={handleCreateTipoVehiculo}
      />
    </div>
  );
}
