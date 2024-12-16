import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getVehiculos = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehiculos = await prisma.vehiculo.findMany();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de los vehículos" });
  }
};

export const createVehiculo = async (req: Request, res: Response): Promise<void> => {
  const { nplaca, modelo, marca, color, tipovehiculoId } = req.body;

  try {
    // Validar si la placa ya existe
    const existingVehiculo = await prisma.vehiculo.findUnique({
      where: { nplaca },
    });

    if (existingVehiculo) {
      res.status(400).json({ message: "La placa ya está registrada." });
      return;
    }

    // Validar que cantidad sea exactamente 1
    const cantidad = 1; // Fijamos la cantidad en 1 para garantizar la regla

    // Crear el vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: { nplaca, modelo, marca, color, tipovehiculoId, cantidad },
    });

    res.status(201).json(vehiculo);
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    res.status(500).json({ message: "Error al crear el vehículo." });
  }
};


export const deleteVehiculo = async (req: Request, res: Response): Promise<void> => {
  const { vehiculoId } = req.params;

  try {
    // Eliminar el vehículo por su ID
    const vehiculo = await prisma.vehiculo.delete({
      where: { vehiculoId },
    });

    res.status(200).json({ message: "Vehículo eliminado correctamente", vehiculo });
  } catch (error) {
    console.error("Error al eliminar el vehículo:", error);
    res.status(500).json({ message: "Error al eliminar el vehículo" });
  }
};

export const updateVehiculo = async (req: Request, res: Response): Promise<void> => {
  const { vehiculoId } = req.params;
  const { tipovehiculoId, nplaca, marca, modelo, color, cantidad } = req.body;

  try {
    // Actualizar el vehículo en la base de datos
    const vehiculo = await prisma.vehiculo.update({
      where: { vehiculoId },
      data: {
        tipovehiculoId,
        nplaca,
        marca,
        modelo,
        color,
        cantidad,
      },
    });

    res.status(200).json({ message: "Vehículo actualizado correctamente", vehiculo });
  } catch (error) {
    console.error("Error al actualizar el vehículo:", error);
    res.status(500).json({ message: "Error al actualizar el vehículo" });
  }
};