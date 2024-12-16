"use client";

import { useState, useEffect } from "react";
import { CreateComprobanteModal } from "../comprobante/CreateComprobanteModal";
import { MaintenanceModal } from "./MaintenanceModal";
import {
  useGetEspaciosQuery,
  useUpdateEstadoEspacioMutation,
} from "@/state/api";
import { toast } from "react-toastify"; // Biblioteca para notificaciones
import axios from "axios";
import { OccupiedSpaceModal } from "./OccupiedSpaceModal";

const EspacioPage = () => {
  const { data: backendSpaces, refetch } = useGetEspaciosQuery(); // Obtener espacios del backend
  const [updateEstadoEspacio] = useUpdateEstadoEspacioMutation(); // Actualizar espacios en el backend
  const uuidSpaces = [
    "a04d9804-33b9-4b57-8d9d-b3dd24b1683e",
    "1a5da9a6-2335-4fba-b5c5-66d52d9306cf",
    "aebaa468-c9e2-4458-8735-f0ea4aa8b983",
    "2d9ce9ef-5495-4d18-a205-053e52c4f0ba",
    "1413daf4-dff8-4129-98dd-df46e4d5060a",
    "876914c6-b71a-4acd-a30d-646920eb9ab9",
    "c26b569a-3632-4971-8cfc-d2bfbe885ca3",
    "36094dc7-c99b-4938-ad3c-d0a8f6cba991",
    "f3b15c96-80c8-4630-8905-09a7bdb0f205",
    "04fcebff-5b5d-438f-a813-4fe80879b07c",
    "0baad06e-6bbe-4ed1-8e1f-66371313ed83",
    "568e380f-3026-4648-a6f2-7252dc1747e4",
    "bae67287-31f6-4a16-b073-2fef0bc17065",
    "45feff95-9c92-4602-bc5b-74164addab2c",
    "016bd1f9-2664-427d-9d47-4db8b1c1e7fc",
    "7eb0d298-aea0-4eb7-9a85-508c06712814",
    "e267e746-687f-4be9-b7a0-e65f1195fed8",
    "f0d82ee7-666c-4968-9002-0e67779be80b",
    "67b1acb5-6228-4c03-807f-1bff38f52ca4",
    "8ff2ab97-04b4-454b-b42d-c002327c0f9a",
    "3f652258-e185-4a9e-b7f2-75c90bb2c9bd",
    "b6f2fad4-9d80-4a34-a153-0c5607c12042",
    "7f95ccf2-4397-4eeb-9535-847cebc01d34",
    "5cb66237-08d4-4c93-aaa2-fe5c8ea9a019",
    "26155ecc-5dc2-4558-9418-14596b9d61e3",
    "f37a5763-1f91-4900-89d2-5b1b9ea92164",
    "160410af-2c9f-47fc-b3d5-f24c5e454860",
    "bdab2d56-558a-4c5a-8a9c-a3eae39f7c45",
    "9e17e816-9548-4a78-9b29-bd633e77d570",
    "d061d73a-38b0-420e-b6b4-f2500f8d977f",
    "ea73eb57-973e-484f-b7cf-33a04d6d1b88",
  ];

  const [spaces, setSpaces] = useState(
    Array.from({ length: uuidSpaces.length }, (_, index) => ({
      index: index + 1,
      id: uuidSpaces[index],
      color: "bg-blue-400",
      status: "DISPONIBLE",
    }))
  );

  const [isOccupiedModalOpen, setIsOccupiedModalOpen] = useState(false); // Estado para el modal de espacio ocupado

  const [isComprobanteModalOpen, setIsComprobanteModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{
    index: number;
    status: string;
    uuid: string;
  } | null>(null);

  // Cargar datos iniciales desde el backend o localStorage
  useEffect(() => {
    if (backendSpaces) {
      const updatedSpaces = spaces.map((space) => {
        const backendSpace = backendSpaces.find(
          (b: any) => parseInt(b.nombre.split(" ")[1], 10) === space.index
        );
        return backendSpace
          ? {
              ...space,
              status: backendSpace.estado,
              color:
                backendSpace.estado === "DISPONIBLE"
                  ? "bg-blue-400"
                  : backendSpace.estado === "OCUPADO"
                  ? "bg-red-300"
                  : "bg-yellow-400",
            }
          : space;
      });
      setSpaces(updatedSpaces);
      localStorage.setItem("spaces", JSON.stringify(updatedSpaces)); // Sincronizar con localStorage
    } else {
      const storedSpaces = localStorage.getItem("spaces");
      if (storedSpaces) {
        setSpaces(JSON.parse(storedSpaces));
      }
    }
  }, [backendSpaces]);

  const updateSpaceStatus = async (index: number, newStatus: string) => {
    // Actualización inmediata del estado en la UI
    setSpaces((prevSpaces) => {
      const updatedSpaces = prevSpaces.map((space) =>
        space.index === index
          ? {
              ...space,
              status: newStatus,
              color:
                newStatus === "DISPONIBLE"
                  ? "bg-blue-400"
                  : newStatus === "OCUPADO"
                  ? "bg-red-300"
                  : "bg-yellow-400",
            }
          : space
      );

     // Guardar el estado actualizado en localStorage solo después de la actualización
    localStorage.setItem("spaces", JSON.stringify(updatedSpaces)); // Sincronizar con localStorage después de la actualización
    return updatedSpaces;
  });

    // Enviar el cambio al backend
    try {
      if (backendSpaces) {
        const espacioToUpdate = backendSpaces.find(
          (b: any) => parseInt(b.nombre.split(" ")[0], 10) === index
        );
        if (espacioToUpdate) {
          await updateEstadoEspacio({
            espacioId: espacioToUpdate.espacioId,
            estado: newStatus,
          });
          refetch(); // Refrescar los datos del backend
          toast.success("Estado actualizado correctamente");
        }
      } else {
        console.warn(
          "backendSpaces no está definido. No se pudo actualizar el estado."
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estado en el backend:", error);
      toast.error("Error al actualizar el estado");
    }
  };

// Cargar los datos del localStorage al montar el componente, si no hay datos del backend
useEffect(() => {
  const savedSpaces = localStorage.getItem("spaces");
  if (savedSpaces) {
    const spacesFromStorage = JSON.parse(savedSpaces);
    setSpaces(spacesFromStorage);
  }
  refetch();
}, []); // Esto solo se ejecuta una vez cuando el componente se monta

const handleSpaceClick = (
  spaceIndex: number,
  spaceStatus: string,
  uuid: string
) => {
  setSelectedSpace({ index: spaceIndex, status: spaceStatus, uuid });

  if (spaceStatus === "MANTENIMIENTO") {
    setIsMaintenanceModalOpen(true);
  } else if (spaceStatus === "OCUPADO") {
    setIsOccupiedModalOpen(true); // Mostrar el modal si el espacio está ocupado
  } else {
    setIsComprobanteModalOpen(true);
  }
};

  const handleCloseComprobanteModal = () => {
    setIsComprobanteModalOpen(false);
    setSelectedSpace(null);
  };

  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedSpace(null);
  };

  const handleCloseOccupiedModal = () => {
    setIsOccupiedModalOpen(false);
    setSelectedSpace(null);
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-800 text-center lg:pb-10 pb-4">
        Mapa de Garaje
      </h1>
      <div className="flex justify-evenly px-28 pb-7">
        <div className="flex gap-2 items-center">
          <div className="bg-blue-400 w-4 h-4 rounded-full text-transparent">
            .
          </div>
          <p className="font-medium">Disponible</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-red-300 w-4 h-4 rounded-full text-transparent">
            .
          </div>
          <p className="font-medium">Ocupado</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-yellow-400 w-4 h-4 rounded-full text-transparent">
            .
          </div>
          <p className="font-medium">En mantenimiento</p>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-6 pb-6 bg-slate-100 rounded-2xl shadow-lg">
        <div className="flex items-baseline gap-[10px] justify-between h-full ">
          <div className="flex flex-col absolute md:h-[400px] top-96 justify-between gap-1 items-center content-center">
            {spaces.slice(0, 5).map(({ index, color, status, id }) => {
              return (
                <div
                  key={index}
                  className={`${color} w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-white font-bold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  onClick={() => handleSpaceClick(index, status, id)}
                >
                  {index}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2 ml-[72px]">
            {spaces.slice(5, 19).map(({ index, color, status, id }) => {
              return (
                <div
                  key={index}
                  className={`${color} h-16 w-16 md:w-[61px] md:h-20 flex items-center justify-center text-white font-bold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  onClick={() => handleSpaceClick(index, status, id)}
                >
                  {index}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-center gap-2">
            {spaces.slice(19, 28).map(({ index, color, status, id }) => {
              return (
                <div
                  key={index}
                  className={`${color} w-16 h-16 md:w-[70px] md:h-20 flex items-center justify-center text-white font-bold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  onClick={() => handleSpaceClick(index, status, id)}
                >
                  {index}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-row justify-center gap-2 ml-[100px] lg:ml-[580px]">
          {spaces.slice(28, 31).map(({ index, color, status, id }) => {
            return (
              <div
                key={index}
                className={`${color} h-16 w-16 md:w-20 md:h-20 flex items-center justify-center text-white font-bold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
                onClick={() => handleSpaceClick(index, status, id)}
              >
                {index}
              </div>
            );
          })}
        </div>
      </div>

      {isComprobanteModalOpen && selectedSpace && (
        <CreateComprobanteModal
          isOpen={isComprobanteModalOpen}
          onClose={handleCloseComprobanteModal}
          selectedEspacioId={String(selectedSpace.index)}
          uuid={selectedSpace.uuid}
          currentStatus={selectedSpace.status}
          onChangeStatus={(newStatus) => {
            updateSpaceStatus(selectedSpace.index, newStatus);
          }}
        />
      )}

      {isMaintenanceModalOpen && selectedSpace && (
        <MaintenanceModal
          isOpen={isMaintenanceModalOpen}
          onClose={handleCloseMaintenanceModal}
          spaceNumber={selectedSpace.index}
          uuid={selectedSpace.uuid}
          onChangeStatus={(newStatus) => {
            updateSpaceStatus(selectedSpace.index, newStatus);
          }}
          onSetAvailable={() =>
            updateSpaceStatus(selectedSpace.index, "DISPONIBLE")
          }
        />
      )}


      {/* Mostrar el modal cuando el estado es OCUPADO */}
      {isOccupiedModalOpen && selectedSpace && (
        <OccupiedSpaceModal
          isOpen={isOccupiedModalOpen}
          onClose={handleCloseOccupiedModal}
        />
      )}
    </>
  );
};

export default EspacioPage;