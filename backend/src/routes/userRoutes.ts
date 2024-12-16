import { Router } from "express";
import { getUsers, createUser, deleteUser, updateUser, loginUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:userId", deleteUser); // Ruta para eliminar usuario
router.put("/:userId", updateUser); // Ruta para actualizar usuario
router.post('/login',loginUser);

export default router;
