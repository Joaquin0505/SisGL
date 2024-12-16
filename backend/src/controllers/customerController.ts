import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de los clientes" });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  const { dni, name, lastname, celphone, direccion } = req.body;

  try {
    // Verificar si el DNI ya existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { dni },
    });

    if (existingCustomer) {
      res.status(400).json({ message: "El DNI ya está registrado." });
      return; // Salimos de la función para evitar continuar
    }

    // Crear el nuevo cliente
    const customer = await prisma.customer.create({
      data: { dni, name, lastname, celphone, direccion },
    });

    res.status(201).json(customer); // Enviar respuesta de éxito
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.params;

  try {
    const customer = await prisma.customer.delete({
      where: { customerId },
    });
    res.status(200).json({ message: "Cliente eliminado correctamente", customer });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.params;
  const { dni, name, lastname, celphone, direccion } = req.body;

  try {
    const customer = await prisma.customer.update({
      where: { customerId },
      data: {
        dni,
        name,
        lastname,
        celphone,
        direccion,
      },
    });
    res.status(200).json({ message: "Cliente actualizado correctamente", customer });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};
