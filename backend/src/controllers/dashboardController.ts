import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Comprobantes emitidos en el último mes (limitado a los 10 más recientes)
    const comprobantesRecientes = await prisma.comprobante.findMany({
      take: 10,
      orderBy: {
        fechaentrada: "desc",
      },
      include: {
        customer: true,
       
        vehiculo: {
          include: {
            tipovehiculo: true, // Incluir el tipo de vehículo
          },
        },
      },
    });

     // Obtener la cantidad de comprobantes por tipo de vehículo
     const tiposVehiculosFrecuentesRaw = await prisma.comprobante.findMany({
      include: {
        vehiculo: {
          include: {
            tipovehiculo: true, // Incluir el tipo de vehículo
          },
        },
      },
    });

    // Agrupar y contar la frecuencia de cada tipo de vehículo
    const tiposVehiculosFrecuentes = tiposVehiculosFrecuentesRaw.reduce((acc, comprobante) => {
      const tipo = comprobante.vehiculo?.tipovehiculo?.nombre || "Desconocido";
      
      // Contamos cuántos comprobantes tienen el mismo tipo de vehículo
      if (acc[tipo]) {
        acc[tipo]++;
      } else {
        acc[tipo] = 1;
      }

      return acc;
    }, {} as Record<string, number>);


    // Convertir el resultado en un array y ordenarlo por frecuencia (de mayor a menor)
    const tiposVehiculosOrdenados = Object.entries(tiposVehiculosFrecuentes)
      .map(([tipo, frecuencia]) => ({ tipoVehiculo: tipo, frecuencia }))
      .sort((a, b) => b.frecuencia - a.frecuencia); // Ordenar por frecuencia



    // Calcular el total de espacios, los ocupados y los en mantenimiento
    const totalSpacesCount = await prisma.espacio.count();
    const occupiedSpacesCount = await prisma.espacio.count({
      where: { estado: "OCUPADO" }, // Espacios ocupados
    });
    const maintenanceSpacesCount = await prisma.espacio.count({
      where: { estado: "MANTENIMIENTO" }, // Espacios en mantenimiento
    });

    // Responder con las métricas del dashboard
    res.json({
      comprobantesRecientes,
      tiposVehiculosFrecuentes: tiposVehiculosOrdenados, // Tipos de vehículos más frecuentes
      parkingSummary: {
        totalSpaces: totalSpacesCount,        // Total de espacios en el parqueo
        occupiedSpaces: occupiedSpacesCount, // Espacios actualmente ocupados
        maintenanceSpaces: maintenanceSpacesCount, // Espacios en mantenimiento
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener métricas del dashboard", error });
  }
};