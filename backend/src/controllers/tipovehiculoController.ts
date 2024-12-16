import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const gettipoVehiculos = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiposvehiculos = await prisma.tipovehiculo.findMany();
    res.json(tiposvehiculos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de los tipos de vehículos" });
  }
};

export const createTipoVehiculo = async (req: Request, res: Response): Promise<void> => {
  const { nombre, tarifa } = req.body;

  try {
    // Validar entrada
    if (!nombre || tarifa === undefined || isNaN(parseInt(tarifa))) {
      res.status(400).json({ message: "Nombre y tarifa son requeridos, y tarifa debe ser un número entero." });
      return;
    }

    // Verificar si ya existe un tipo con el mismo nombre
    const existingTipo = await prisma.tipovehiculo.findUnique({
      where: { nombre },
    });

    if (existingTipo) {
      res.status(400).json({ message: "El tipo de vehículo ya existe." });
      return;
    }

    // Crear el tipo de vehículo
    const tipoVehiculo = await prisma.tipovehiculo.create({
      data: { nombre, tarifa: parseInt(tarifa) }, // Convertir tarifa a entero
    });

    res.status(201).json(tipoVehiculo);
  } catch (error) {
    console.error("Error al crear el tipo de vehículo:", error);
    res.status(500).json({ message: "Error al crear el tipo de vehículo." });
  }
};


