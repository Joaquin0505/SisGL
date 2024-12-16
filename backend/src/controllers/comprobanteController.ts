import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComprobante = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    customerId,
    espacioId,
    vehiculoId,
    fechaentrada,
    descripcion,
    estadoComp,
  } = req.body;
  try {
    // Validar datos de entrada
    if (!customerId || !espacioId || !vehiculoId || !fechaentrada) {
      res.status(400).json({ message: "Faltan datos obligatorios." });
      return;
    }

    const espacio = await prisma.espacio.findUnique({
      where: { espacioId },
    });
    if (!espacio || espacio.estado !== "DISPONIBLE") {
      res.status(400).json({ message: "El espacio no está disponible." });
      return;
    }

    // Asignar estado predeterminado si no se proporciona

    const comprobante = await prisma.comprobante.create({
      data: {
        customerId,
        espacioId,
        vehiculoId,
        fechaentrada: new Date(fechaentrada),
        descripcion,
        estadoComp,
      },
    });
    const estadoComprobante = estadoComp || "POR_PAGAR"; // Valor predeterminado

    // Actualiza el estado del espacio a OCUPADO
    await prisma.espacio.update({
      where: { espacioId },
      data: { estado: "OCUPADO" },
    });

    res.status(201).json(comprobante);
  } catch (error) {
    console.error("Error al crear comprobante:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener todos los comprobantes
export const getComprobante = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comprobantes = await prisma.comprobante.findMany({
      include: {
        customer: true,
        espacio: true,
        vehiculo: {
          include: {
            tipovehiculo: true,
          },
        },
      },
    });
    res.status(200).json(comprobantes);
  } catch (error: any) {
    console.error("Error al obtener los comprobantes:", error.message);
    res.status(500).json({ message: "Error al obtener los comprobantes." });
  }
};

// Obtener un comprobante por ID
export const getComprobanteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { comprobanteId } = req.params;

  try {
    const comprobante = await prisma.comprobante.findUnique({
      where: { comprobanteId },
      include: {
        vehiculo: true,
        customer: true,
        espacio: true,
      },
    });

    if (!comprobante) {
      res.status(404).json({ message: "Comprobante no encontrado." });
      return;
    }

    res.status(200).json(comprobante);
  } catch (error: any) {
    console.error("Error al obtener el comprobante:", error.message);
    res.status(500).json({ message: "Error al obtener el comprobante." });
  }
};

// Filtrar comprobantes por placa
export const getComprobantesByPlaca = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { placa } = req.query;

  try {
    const comprobantes = await prisma.comprobante.findMany({
      where: {
        vehiculo: {
          nplaca: String(placa),
        },
      },
      include: {
        vehiculo: true,
        customer: true,
        espacio: true,
      },
    });

    res.status(200).json(comprobantes);
  } catch (error: any) {
    console.error("Error al filtrar comprobantes:", error.message);
    res.status(500).json({ message: "Error al filtrar comprobantes." });
  }
};

export const createVehiculo = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const retirarComprobante = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { comprobanteId } = req.params;

  try {
    const comprobante = await prisma.comprobante.findUnique({
      where: { comprobanteId },
      include: { espacio: true },
    });

    if (!comprobante) {
      res.status(404).json({ message: "Comprobante no encontrado." });
      return;
    }

    console.log("-----------------comprobante----------------");
    console.log(comprobante);

    // Actualiza el estado del espacio a DISPONIBLE
    const espacioUpdate = await prisma.espacio.update({
      where: { espacioId: comprobante.espacioId },
      data: { estado: "DISPONIBLE" },
    });

    console.log("-----------------espacioUpdate----------------");
    console.log(espacioUpdate);

    // Aquí puedes también cambiar el estado del comprobante si es necesario
    await prisma.comprobante.update({
      where: { comprobanteId },
      data: { estadoComp: "RETIRADO" }, // Establecer estado como retirado o completado
    });

    res
      .status(200)
      .json({ message: "Comprobante retirado y espacio liberado." });
  } catch (error: any) {
    console.error("Error al retirar el comprobante:", error.message);
    res.status(500).json({ message: "Error al retirar el comprobante." });
  }
};

export const updateComprobante = async (req: Request, res: Response): Promise<void> => {
  const { comprobanteId } = req.params; // ID del comprobante que se desea editar
  const { estadoComp } = req.body; // Solo se necesita el nuevo estado

  try {
    // Validar que el comprobante existe
    const comprobanteExistente = await prisma.comprobante.findUnique({
      where: { comprobanteId },
    });

    if (!comprobanteExistente) {
      res.status(404).json({ message: "Comprobante no encontrado." });
      return;
    }

    // Validar que el estado es válido
    const estadosValidos = ["POR_PAGAR", "PAGADO", "ANULADO"];
    if (!estadoComp || !estadosValidos.includes(estadoComp)) {
      res.status(400).json({ message: "Estado no válido." });
      return;
    }

    // Actualizar el estado del comprobante
    const comprobanteActualizado = await prisma.comprobante.update({
      where: { comprobanteId },
      data: { estadoComp },
    });

    res.status(200).json({
      message: "Estado del comprobante actualizado correctamente.",
      comprobante: comprobanteActualizado,
    });
  } catch (error: any) {
    console.error("Error al actualizar el estado del comprobante:", error.message);
    res.status(500).json({ message: "Error al actualizar el estado del comprobante." });
  }
};
