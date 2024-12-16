
import { Router } from "express";
import { gettipoVehiculos, createTipoVehiculo } from "../controllers/tipovehiculoController";
const router = Router();

router.get("/", gettipoVehiculos);
router.post("/", createTipoVehiculo);

export default router;