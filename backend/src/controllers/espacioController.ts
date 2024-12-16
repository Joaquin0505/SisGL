import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los espacios
export const getEspacios = async (req: Request, res: Response): Promise<void> => {
  try {
    const espacios = await prisma.espacio.findMany(); // Devuelve todos los espacios
    res.status(200).json(espacios);
  } catch (error) {
    console.error("Error al obtener espacios:", error);
    res.status(500).json({ message: "Error al obtener espacios." });
  }
};

// Actualizar el estado de un espacio
export const updateEspacioEstado = async (req: Request, res: Response): Promise<void> => {
  const { espacioId, estado } = req.body;

  console.log(req)

   // Validación de los valores del estado
   const validEstados = ['DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'];
   if (!validEstados.includes(estado)) {
     res.status(400).json({ message: "Estado inválido. Los valores permitidos son: 'Disponible', 'Ocupado', 'Mantenimiento'." });
     return;
   }
 
   try {
     // Verificar si el espacio existe
     const espacio = await prisma.espacio.findUnique({
       where: { espacioId },
     });

    if (!espacio) {
      res.status(404).json({ message: "Espacio no encontrado." });
      return;
    }

    // Actualizar el estado del espacio
    const updatedEspacio = await prisma.espacio.update({
      where: { espacioId },
      data: { estado },
    });


    res.status(200).json(updatedEspacio);
  } catch (error) {
    console.error("Error al actualizar estado del espacio: x", error);
    

    res.status(500).json({ message: "Error al actualizar estado del espacio. y7" });
  }
};


export const getEspacioById = async (req: Request, res: Response): Promise<void> => {
  const { espacioId } = req.params;
  
  try {
    const espacio = await prisma.espacio.findUnique({
      where: { espacioId },
    });

    if (!espacio) {
      res.status(404).json({ message: 'Espacio no encontrado.' });
      return;
    }

    res.status(200).json(espacio);
  } catch (error) {
    console.error('Error al obtener el espacio:', error);
    res.status(500).json({ message: 'Error al obtener el espacio.' });
  }
};



