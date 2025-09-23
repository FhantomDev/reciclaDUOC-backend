import { Router } from "express";
import { crearReciclaje } from "../controllers/reciclajeController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /reciclaje
router.post("/registroReciclaje", verificarToken, crearReciclaje);

export default router;