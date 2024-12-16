import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de los usuarios" });
  }
};
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { dni, name, lastname, celphone, direccion, email, password } = req.body;

  try {
    // Verificar si el DNI ya existe
    const existingUser = await prisma.users.findUnique({
      where: { dni },
    });

    if (existingUser) {
      res.status(400).json({ message: "El DNI ya está registrado." });
      return; // Salimos de la función para evitar continuar
    }
         // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const user = await prisma.users.create({
      data: { dni, name, lastname, celphone, direccion, email, password:hashedPassword },
    });
    res.status(201).json(user); // Enviar la respuesta de éxito
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await prisma.users.delete({
      where: { userId },
    });
    res.status(200).json({ message: "Usuario eliminado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { dni, name, lastname, celphone, direccion, email, password } = req.body;


  
  try {
    const user = await prisma.users.update({
      where: { userId },
      data: {
        dni,
        name,
        lastname,
        celphone,
        direccion,
        email,
        password,
      },
    });
    res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ message: "usuario incorrectos." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "contraseña incorrectos." });
      return;
    }
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      "JWT_SECRET",
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
