import { useGetDashboardMetricsQuery } from "@/state/api";
import { CheckCircle } from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export const CardParkingSummary = () => {
  const { data: dashboardMetrics, isLoading, isError } = useGetDashboardMetricsQuery();
  const parkingSummary = dashboardMetrics?.parkingSummary || { 
    totalSpaces: 0, 
    occupiedSpaces: 0,
    maintenanceSpaces: 0  };
  const occupancyRate = parkingSummary.totalSpaces 
    ? ((parkingSummary.occupiedSpaces / parkingSummary.totalSpaces) * 100).toFixed(2) 
    : "0.00";

  // Datos para el gráfico circular
  const chartData = [
    { name: "Ocupado", value: parkingSummary.occupiedSpaces },
    { name: "Disponible", value: parkingSummary.totalSpaces - parkingSummary.occupiedSpaces },
    { name: "Mantenimiento", value: parkingSummary.maintenanceSpaces }
  ];

  // Colores para cada sección del gráfico
  const COLORS = ["#FF8042", "#00C49F", "#FFBB28" ];

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between h-full">
      <h2 className="text-lg font-semibold mb-3">Resumen de Ocupación del Parqueo</h2>
      
      {isLoading ? (
        <div className="text-center py-10">Cargando datos de ocupación...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Error al cargar los datos</div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <p className="text-base font-medium">
              Espacios Ocupados: <strong>{parkingSummary.occupiedSpaces}</strong> / {parkingSummary.totalSpaces}
            </p>
            <p>Espacios en mantenimiento: {parkingSummary.maintenanceSpaces}</p>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-600">
            <CheckCircle className="text-green-500 mr-2" />
            Tasa de Ocupación: <strong>{occupancyRate}%</strong>
          </div>

          {/* Gráfico Circular */}
          <div className="mt-6 w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};