import { useGetDashboardMetricsQuery } from "@/state/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const CardVehiculosFrecuentes = () => {
  const { data: dashboardMetrics, isLoading, isError } = useGetDashboardMetricsQuery();
  
  // Acceder a la propiedad correcta en la respuesta de la API
  const vehiculosFrecuentes = dashboardMetrics?.tiposVehiculosFrecuentes || [];

  const vehiculosOrdenados = [...vehiculosFrecuentes]
  .map(item => ({
    ...item,
    frecuencia: typeof item.frecuencia === 'number' ? item.frecuencia : 0, // Asignar 0 si no es un número
  }))
  .sort((a, b) => b.frecuencia - a.frecuencia);

  // Colores para las barras
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6363"];

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between h-full">
      <h2 className="text-lg font-semibold mb-3">Vehículos Más Frecuentes</h2>

      {isLoading ? (
        <div className="text-center py-10">Cargando datos...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Error al cargar los datos</div>
      ) : vehiculosOrdenados.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={vehiculosOrdenados}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="tipoVehiculo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frecuencia" fill="#8884d8">
              {vehiculosOrdenados.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center">No hay vehículos frecuentes.</p>
      )}
    </div>
  );
};