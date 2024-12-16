import { useCallback, useEffect, useRef, useState } from "react";

import { useGetComprobanteQuery } from "@/state/api";

interface ListarComprobanteModalProps{
  isOpen:boolean;
  onClose:()=>void;
}


export const ListaComprobanteModal = ({ 
  isOpen,
   onClose 
  }: ListarComprobanteModalProps)=>{ 
   
  const { data: comprobantes, isLoading,  } = useGetComprobanteQuery();
  const [localComprobantes, setLocalComprobantes] = useState<any[]>([]);
  const [searchtipovehiculo, setSearchtipovehiculo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (comprobantes?.length) {
      setLocalComprobantes(comprobantes);
    }
  }, [comprobantes]);

  const filterComprobantes = () => {
    return localComprobantes.filter((comprobante) => {
      const placa = comprobante.vehiculo?.tipovehiculo?.nombre?.toLowerCase() || "";
      const placaMatch = placa.includes(searchtipovehiculo.toLowerCase());
      const fechaEntrada = new Date(comprobante.fechaentrada);
      const startMatch = startDate ? fechaEntrada >= new Date(startDate) : true;
      const endMatch = endDate ? fechaEntrada <= new Date(endDate) : true;
      return placaMatch && startMatch && endMatch;
    });
  };

  const filteredComprobantes = filterComprobantes();

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Lista de comprobantes</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleClearDates = useCallback(() => {
    setStartDate(""); // Limpiar fecha inicio
    setEndDate("");   // Limpiar fecha fin
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">Cargando comprobantes...</div>;
  }


  if (!isOpen)return null;


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg relative">
        <button
          className="absolute top-2 text-4xl right-2 text-red-500 hover:text-red-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lista de Comprobantes</h1>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar tipo de Vehiculo"
            className="bg-gray-100 border px-4 py-2 rounded-lg w-full"
            value={searchtipovehiculo}
            onChange={(e) => setSearchtipovehiculo(e.target.value)}
          />
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <input type="date" 
            className="p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            />
            <input 
              type="date"
              className="p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} 
            />
            <button 
              className="rounded-lg bg-purple-500 px-4 text-white py-2 hover:bg-purple-600"
              onClick={handleClearDates}
            >
              Limpiar
            </button>
          </div>
        </div>
        <div ref={printRef}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Vehiculo</th>
                <th className="border px-4 py-2">N° Placa</th>
                <th className="border px-4 py-2">Cliente</th>
                <th className="border px-4 py-2">Fecha Entrada</th>
                <th className="border px-4 py-2">Tarifa</th>
                <th className="border px-4 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {filteredComprobantes.map((comprobante) => (
                <tr key={comprobante.comprobanteId}>
                  <td className="border px-4 py-2">{comprobante.vehiculo?.tipovehiculo?.nombre || ""}</td>
                  <td className="border px-4 py-2">{comprobante.vehiculo?.nplaca || "No especificado"}</td>
                  <td className="border px-4 py-2">{`${comprobante.customer?.name || ""} ${comprobante.customer?.lastname || ""}`}</td>
                  <td className="border px-4 py-2">{new Date(comprobante.fechaentrada).toLocaleString()}</td>
                  <td className="border px-4 py-2">S/. {comprobante.vehiculo?.tipovehiculo?.tarifa}</td>
                  <td className="border px-4 py-2">{comprobante.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handlePrint} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Imprimir
        </button>
      </div>
    </div>
  );
};