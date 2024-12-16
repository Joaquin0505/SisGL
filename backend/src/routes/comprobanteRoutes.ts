import express from "express";
import {
  createComprobante,
  getComprobante,
  getComprobanteById,
  retirarComprobante,
  getComprobantesByPlaca,
  createVehiculo,
  updateComprobante,
} from "../controllers/comprobanteController";

const router = express.Router();

// Ruta para crear un comprobante
router.post("/", createComprobante);

router.post("/", createVehiculo);
// Obtener todos los comprobantes
router.get("/", getComprobante);

// Obtener un comprobante por ID
router.get("/:id", getComprobanteById);

// Filtrar comprobantes por placa
router.get("/filter", getComprobantesByPlaca);

router.patch("/retirar/:comprobanteId", retirarComprobante);

router.put("/:comprobanteId", updateComprobante);

export default router;
