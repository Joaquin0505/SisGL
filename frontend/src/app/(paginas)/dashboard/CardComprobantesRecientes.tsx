import { useGetDashboardMetricsQuery } from "@/state/api";

export const CardComprobantesRecientes = () => {
  const { data: dashboardMetrics, isLoading, isError } = useGetDashboardMetricsQuery();
  const comprobantesRecientes = dashboardMetrics?.comprobantesRecientes || [];

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between h-full">
      <h2 className="text-lg font-semibold mb-3">Comprobantes Recientes</h2>

      {isLoading ? (
        <div className="text-center py-10">Cargando datos...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Error al cargar los datos</div>
      ) : (
        <div>
          {comprobantesRecientes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {comprobantesRecientes.map((comprobante) => (
                <li key={comprobante.comprobanteId} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{comprobante.customer?.name}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(comprobante.fechaentrada as string).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-base font-medium text-green-600">
                      {comprobante.vehiculo?.tipovehiculo?.nombre}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay comprobantes recientes.</p>
          )}
        </div>
      )}
    </div>
  );
};