'use client'


import { useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useGetCustomersQuery, useCreateCustomerMutation, useDeleteCustomerMutation, useUpdateCustomerMutation } from "@/state/api";
import { CreateCustomerModal } from "./CreateCustomerModal";
import { useAppSelector } from "@/app/redux";


interface Customer {
  customerId: string;
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
}

export default function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchDNI, setSearchDNI] = useState("");
  const { data: customers, isError, isLoading } = useGetCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();



  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleCreateOrUpdateCustomer = async (customerData: Customer) => {
    if (isEditMode && selectedCustomer) {
      await updateCustomer({ customerId: selectedCustomer.customerId, data: customerData });
    } else {
      await createCustomer(customerData);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      await deleteCustomer(customerId);
    }
  };

  const columns: GridColDef[] = [
    { field: "dni", headerName: "DNI", width: 120 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "lastname", headerName: "Apellido", width: 150 },
    { field: "celphone", headerName: "Celular", width: 130 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdEdit color="#22c11a" size={25} />}
          label="Editar"
          onClick={() => handleEditCustomer(params.row)}
        />,
        <GridActionsCellItem
          icon={<MdDeleteForever color="#c11a3f" size={25} />}
          label="Eliminar"
          onClick={() => handleDeleteCustomer(params.row.customerId)}
        />
      ],
    },
  ];

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !customers) return <div>Error al cargar los clientes</div>;

  const filteredCustomers = customers.filter((customer) =>
    customer.dni.toLowerCase().includes(searchDNI.toLowerCase())
  );

  return (
    <div className="flex flex-col content-center h-full justify-center items-center pt-1 xl:pt-1 px-4 mt-6 ml-3">
      <div className="flex flex-col gap-6 bg-white  w-full rounded-2xl shadow-lg  shadow-slate-500 pb-11 pt-8 px-5">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="md:text-3xl font-extrabold text-gray-800 text-3xl">
            Lista de Clientes
          </h1>
          <div className="border-gray-500 border-2 rounded-2xl p-2 flex items-center px-3">
            <input
              type="text"
              placeholder="Buscar por DNI"
              className="outline-none bg-transparent"
              value={searchDNI}
              onChange={(e) => setSearchDNI(e.target.value)}
            />
            <FaSearch color="#146984" />
          </div>
        </div>
      <div style={{ height: 330, width: "100%" }}>
      <DataGrid
            rows={filteredCustomers}
            columns={columns}
            getRowId={(row) => row.customerId}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            className="bg-white text-gray-800"
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
    <button
        className="bg-blue-500 w-40 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
        onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
          setSelectedCustomer(null);
        }}
      >
        Agregar Cliente
      </button>

      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrUpdateCustomer}
        initialData={isEditMode ? selectedCustomer : null}
      />
    </div>
    
    </div>
  );
}
