"use client";

import {
  Comprobante,
  useGetComprobanteQuery,
  useRetirarComprobanteMutation,
} from "@/state/api";
import { CarTaxiFrontIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { ListaComprobanteModal } from "./ListaComprobanteModal";
import { EdithModalComprobante } from "./EdithModalComprobante";

type ComprobanteFormData = {
  comprobanteId: string;
  vehiculoId: string;
  customerId: string;
  userId?: string;
  espacioId: string;
  fechaentrada?: Date | string | null;
  fechasalida?: Date;
  descripcion: string | null;
  estadoComp: string;
};

const ComprobantePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedComprobante, setSelectedComprobante] = useState<Comprobante | null>(null);
  const [isModalOpenComp, setIsModalOpenComp] = useState(false);
  

  const { data: comprobantes, isLoading, refetch } = useGetComprobanteQuery();
  const [localComprobantes, setLocalComprobantes] = useState<any[]>([]);
 
  const [searchPlaca, setSearchPlaca] = useState("");
  const [startDate, ] = useState("");
  const [endDate, ] = useState("");
  const [retirarComprobante] = useRetirarComprobanteMutation();

  const handleOpenModalComprobante = (comprobante:Comprobante) => {
    setSelectedComprobante(comprobante);
    setIsModalOpenComp(true);
  };
  const handleCloseModalComprobante = () => {
    setSelectedComprobante(null);
    setIsModalOpen(false);
    refetch();
  };

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (comprobantes) {
      setLocalComprobantes(comprobantes);
    }
  }, [comprobantes]);

  // Nueva función de filtrado
  const filterComprobantes = () => {
    return localComprobantes.filter((comprobante) => {
      const placa = comprobante.vehiculo?.nplaca?.toLowerCase() || ""; // Aseguramos que siempre sea string
      const placaMatch = placa.includes(searchPlaca.toLowerCase());
      const fechaEntrada = new Date(comprobante.fechaentrada);
      const startMatch = startDate ? fechaEntrada >= new Date(startDate) : true;
      const endMatch = endDate ? fechaEntrada <= new Date(endDate) : true;
      const estadoMatch = comprobante.estadoComp !== "RETIRADO";

      return placaMatch && startMatch && endMatch && estadoMatch;
    });
  };
  const filteredComprobantes = filterComprobantes();

  const handlePrintTicket = (comprobante: any) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(
        `<html>
          <head>
            <title>Comprobante - Garaje Libertad</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { width: 100px; height: auto; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .footer { margin-top: 20px; text-align: center; font-size: 12px; color: gray; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="logo.png" alt="Logo" />
              <h1>Garaje Libertad</h1>
              <p>Celular: 910006123</p>
              <p>Dirección: jr. libertad N°268</p>
            </div>
            <div>
              <strong>Vehículo:</strong> ${
                comprobante.vehiculo?.tipovehiculo?.nombre || "N/A"
              }<br />
              <strong>Placa:</strong> ${
                comprobante.vehiculo?.nplaca || "N/A"
              }<br />
              <strong>Tarifa:</strong> ${
                comprobante.vehiculo?.tipovehiculo?.tarifa || "N/A"
              }<br />
              <strong>Cliente:</strong> ${
                comprobante.customer?.name || "N/A"
              } ${comprobante.customer?.lastname || "N/A"}<br />
              <strong>DNI:</strong> ${comprobante.customer?.dni || "N/A"}<br />
              <strong>Fecha:</strong> ${new Date(
                comprobante.fechaentrada
              ).toLocaleDateString()}<br />
              <strong>Hora Entrada:</strong> ${new Date(
                comprobante.fechaentrada
              ).toLocaleTimeString()}<br />
            </div>
            <div class="footer">
              Gracias por confiar en Garaje Libertad
            </div>
          </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleRetirar = async (comprobanteId: string, espacioId: string) => {
    try {

      // Verificar si el estado del comprobante es "Pagado"
    const comprobante = localComprobantes.find(
      (comprobante) => comprobante.comprobanteId === comprobanteId
    );


    if (!comprobante) {
      alert("Comprobante no encontrado");
      return;
    }

    if (comprobante.estadoComp !== "PAGADO") {
      alert("El comprobante debe estar en estado 'Pagado' para retirarlo.");
      return;
    }

      if (!comprobanteId) {
        alert("ID del comprobante no válido");
        return;
      }
      console.log(comprobanteId);
      const response = await retirarComprobante(comprobanteId);

      if (response) {
        setLocalComprobantes((prev) =>
          prev.filter(
            (comprobante) => comprobante.comprobanteId !== comprobanteId
          )
        );
          // Actualizar el estado del espacio a "DISPONIBLE"     
         refetch();
      }
      // alert("Comprobante retirado exitosamente");  
    } catch (error: any) {
      console.error(
        "Error al retirar comprobante:",
        error?.data || error?.message || error
      );
      alert(
        `Hubo un error al retirar el comprobante: ${
          error?.data?.message || error?.message || "Error desconocido."
        }`
      );
    }
  };

 

  if (isLoading) {
    return <div className="text-center mt-10">Cargando comprobantes...</div>;
  }
  return (
    <div className="p-2">
     {/* Botones de reporte y busqueda */}
      <div className="flex flex-row gap-5 justify-between">
        <div className="relative py-1">
          <input
            type="text"
            placeholder="Buscar N° de placa"
            className="bg-slate-200 border-none outline-1 px-6 py-3 rounded-[30px] w-full"
            value={searchPlaca}
            onChange={(e) => setSearchPlaca(e.target.value)}
          />
          <BsSearch
            className="absolute top-0 right-0 mt-4 mr-5 text-gray-500 hover:text-cyan-400"
            size={15}
          />
        </div>

        <button
          className="text-xl font-bold text-gray-100 mb-14 mt-1 bg-green-600 hover:bg-green-700 rounded-xl px-5 py-2"
          onClick={() => setIsModalOpen(true)}
        >
          Reporte de comprobantes
        </button>
        <ListaComprobanteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-center w-full h-full lg:grid-cols-3 xl:grid-cols-4 ">
        {filteredComprobantes.map((comprobante) => (
          <div
            key={comprobante.comprobanteId}
            className="flex flex-col border-gray-300 rounded-lg shadow-lg"
          >
            {/* Cabeza del comprobante */}
            <div className="flex flex-row items-center justify-between px-6 gap-2 bg-purple-500 text-black rounded-t-lg py-4">
              <CarTaxiFrontIcon size={24} />
              <div className="flex flex-col">
                <strong>Vehículo:</strong>{" "}
                {comprobante.vehiculo?.tipovehiculo?.nombre || "N/A"}
              </div>
              <div className="flex flex-col px-2">
                <strong>Placa:</strong>{" "}
                {comprobante.vehiculo?.nplaca || "No especificado"}
              </div>
              <div className="flex flex-col">
                <strong>Tarifa:</strong>{" "}
                {`S/. ${comprobante.vehiculo?.tipovehiculo?.tarifa || "N/A"}`}
              </div>
            </div>
            {/* Cuerpo del comprobante */}
            <div className="flex flex-col justify-start px-4 py-4 bg-blue-400 text-black space-y-3">
              <span>
                <strong>Cliente:</strong> {comprobante.customer?.name || "N/A"}{" "}
                {comprobante.customer?.lastname || "N/A"}
              </span>
              <span>
                <strong>DNI:</strong> {comprobante.customer?.dni}
              </span>
              <span>
                <strong>Fecha:</strong>{" "}
                {new Date(comprobante.fechaentrada).toLocaleDateString()}
              </span>
              <span>
                <strong>Hora Entrada:</strong>{" "}
                {new Date(comprobante.fechaentrada).toLocaleTimeString()}
              </span>
              <span>
                <strong>Estado de Comprobante:</strong> {comprobante.estadoComp}
              </span>
            </div>

            {/* Pie del comprobante */}
            <div className="flex flex-row items-center bg-purple-500 justify-evenly py-4 rounded-b-lg">
              <button
                className="bg-blue-500 rounded-md px-4 py-2 text-black text-xs cursor-pointer hover:bg-white hover:text-violet-500"
                onClick={() => handleOpenModalComprobante(comprobante)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 rounded-md px-4 py-2 text-black text-xs cursor-pointer hover:bg-white hover:text-violet-500"
                onClick={() =>
                  handleRetirar(comprobante.comprobanteId, comprobante.espcioId)
                }
              >
                Retirar
              </button>
              <button
                onClick={() => handlePrintTicket(comprobante)}
                className="bg-green-500 rounded-md px-4 py-2 text-black text-xs cursor-pointer hover:bg-white hover:text-violet-500"
              >
                🖨️ Imprimir
              </button>
            </div>
          </div>
        ))}
        {isModalOpenComp && selectedComprobante && (
          <EdithModalComprobante
            isOpen={isModalOpenComp}
            onClose={handleCloseModalComprobante}
            comprobante={selectedComprobante}
            
          />
        )}
      </div>
    </div>
  );
};

export default ComprobantePage;