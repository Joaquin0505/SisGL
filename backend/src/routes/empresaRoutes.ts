import { Router } from "express";
import { getEmpresa, updateEmpresa } from "../controllers/empresaController";

const router = Router();

// Obtener la empresa
router.get("/", getEmpresa);

// Actualizar los datos de la empresa (con parámetro de empresaId)
router.put("/:empresaId", updateEmpresa);

export default router;