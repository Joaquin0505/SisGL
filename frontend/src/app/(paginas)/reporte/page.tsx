'use client'
import { useState, useEffect } from 'react';
import { Search, Eye, FileText } from 'lucide-react';

interface Comprobante {
  comprobanteId: string;
  customer: {
    name: string;
    lastname: string;
  };
  fechaentrada: string;
  fechasalida: string | null;
  Detallecomprobante: Array<{
    vehiculo: {
      marca: string;
      modelo: string;
      nplaca: string;
      tipovehiculo: {
        descripcion: string;
      };
    };
    importetotal: number;
  }>;
}

export default function ReportePage() {
  const [filtros, setFiltros] = useState({
    tipoVehiculo: '',
    fechaInicio: '',
    fechaFin: '',
  });
  
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarComprobantes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Construir query params
      const params = new URLSearchParams();
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      if (filtros.tipoVehiculo) params.append('tipovehiculoId', filtros.tipoVehiculo);

      // Asegúrate de que esta URL coincida con tu configuración de backend
      const response = await fetch(`/api/reporte/comprobantes?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      setComprobantes(data);
    } catch (err) {
      console.error('Error al buscar comprobantes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async (comprobanteId?: string) => {
    try {
      const params = new URLSearchParams();
      if (comprobanteId) params.append('comprobanteId', comprobanteId);
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

      const response = await fetch(`/api/reporte/exportar?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al generar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${comprobanteId || 'general'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      setError(err instanceof Error ? err.message : 'Error al generar PDF');
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    buscarComprobantes();
  }, []);

  return (
    <div className="flex flex-col justify-evenly p-3 m-6 gap-10">
      {/* Panel de Filtros */}
      <div className="flex flex-col md:flex-row justify-center items-center py-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tipo de vehículo"
            value={filtros.tipoVehiculo}
            onChange={(e) => setFiltros(prev => ({ ...prev, tipoVehiculo: e.target.value }))}
            className="bg-[#f2f3f5] border-none outline-none px-6 py-3 rounded-full w-full focus:ring-2 focus:ring-purple-500 text-black active:text-black"
          />
          <div className="absolute top-0 right-0 mt-3 mr-5 text-gray-500 hover:text-cyan-400">
            <Search size={18} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input 
            type="date" 
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
            className="p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500" 
          />
          <input 
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))} 
            className="p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500" 
          />
          <button 
            onClick={buscarComprobantes}
            className="rounded-lg bg-purple-500 px-4 text-white py-2 hover:bg-purple-600"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      

      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Tipo</th>
              <th className="py-3 px-4 text-left">Placa</th>
              <th className="py-3 px-4 text-left">Cliente</th>
              <th className="py-3 px-4 text-left">Fecha de Ingreso</th>
              <th className="py-3 px-4 text-left">Tarifa</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Cargando...</td>
              </tr>
            ) : comprobantes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No se encontraron resultados</td>
              </tr>
            ) : (
              comprobantes.map((comp) => (
                <tr key={comp.comprobanteId} className="border-b border-gray-200">
                  <td className="py-3 px-4">{comp.Detallecomprobante[0]?.vehiculo.tipovehiculo.descripcion}</td>
                  <td className="py-3 px-4">{comp.Detallecomprobante[0]?.vehiculo.nplaca}</td>
                  <td className="py-3 px-4">{`${comp.customer.name} ${comp.customer.lastname}`}</td>
                  <td className="py-3 px-4">{new Date(comp.fechaentrada).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    S/ {comp.Detallecomprobante[0]?.importetotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-4">
                      <button 
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => {/* Implementar vista detalle */}}
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => generarPDF(comp.comprobanteId)}
                      >
                        <FileText size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botón de reporte general */}
      <div className="flex justify-center py-4">
        <button 
          onClick={() => generarPDF()}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Generar Reporte General
        </button>
      </div>
    </div>
  );
}