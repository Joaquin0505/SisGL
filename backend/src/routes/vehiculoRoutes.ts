

import { Router } from "express";
import { getVehiculos, createVehiculo, deleteVehiculo, updateVehiculo } from "../controllers/vehiculoController";

const router = Router();




router.get("/", getVehiculos);
router.post("/", createVehiculo);
router.delete("/:vehiculoId", deleteVehiculo); // Ruta para eliminar vehículo
router.put("/:vehiculoId", updateVehiculo); // Nueva ruta para actualizar vehículo

export default router;