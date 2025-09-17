import { Router } from "express";
import { registrarUsuario } from "../controllers/registroController.js";
import { loginUsuario } from "../controllers/loginController.js";
import { obtenerPerfil } from "../controllers/perfilController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";


const router = Router();

// POST /usuarios/registro
router.post("/registro", registrarUsuario);

// POST /usuarios/login
router.post("/login", loginUsuario);

// GET /usuarios/perfil/:id
router.get("/perfil", verificarToken, obtenerPerfil);


export default router;