import express from "express";
import { getEspacios, updateEspacioEstado ,getEspacioById } from "../controllers/espacioController";

const router = express.Router();

// Ruta para obtener todos los espacios
router.get("/", getEspacios);

// Ruta para actualizar el estado de un espacio
router.put("/", updateEspacioEstado);

router.get('/:espacioId', getEspacioById);

export default router;
