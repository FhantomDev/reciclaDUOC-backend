import { Router } from "express";
import { registrarUsuario } from "../controllers/registroController.js";

const router = Router();

// POST /usuarios/register
router.post("/registro", registrarUsuario);

export default router;