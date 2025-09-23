import { Router } from "express";
import { registrarUsuario } from "../controllers/registroController.js";
import { loginUsuario } from "../controllers/loginController.js";
import { getPerfil, updatePerfil } from "../controllers/perfilController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";


const router = Router();

// POST /usuarios/registro
router.post("/registroUsuario", registrarUsuario);

// POST /usuarios/login
router.post("/loginUsuario", loginUsuario);

// GET /usuarios/getPerfil
router.get("/getPerfil", verificarToken, getPerfil);

// PUT /usuarios/updatePerfil
router.put("/updatePerfil", verificarToken, updatePerfil);



export default router;