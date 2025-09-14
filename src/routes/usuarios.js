import { Router } from "express";
import { registrarUsuario } from "../controllers/registroController.js";
import { loginUsuario } from "../controllers/loginController.js";

const router = Router();

// POST /usuarios/registro
router.post("/registro", registrarUsuario);

// POST /usuarios/login
router.post("/login", loginUsuario);

export default router;