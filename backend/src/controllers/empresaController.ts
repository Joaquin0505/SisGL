import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();

// Configuración de multer para subir imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para obtener la empresa
export const getEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresa = await prisma.empresa.findMany();
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de la empresa" });
  }
};

// Ruta para actualizar la empresa (incluyendo imagen)
export const updateEmpresa = async (req: Request, res: Response): Promise<void> => {
  const { ruc, name } = req.body;
  const { empresaId } = req.params; // Obtén el empresaId desde los parámetros de la URL
  const imagen = req.body.imagen; // Suponemos que la imagen está en formato base64

  try {
    const empresa = await prisma.empresa.update({
      where: { empresaId },
      data: { ruc, name, imagen }, // Actualizamos el campo imagen también
    });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la información de la empresa" });
  }
};

// Ruta para manejar la carga de imagen
export const uploadImage = upload.single("imagen"); // "imagen" es el nombre del campo en el formulario
