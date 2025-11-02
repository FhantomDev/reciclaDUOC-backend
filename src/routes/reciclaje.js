import { Router } from "express";
import { crearReciclaje } from "../controllers/reciclajeController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

// POST /reciclaje
router.post("/registroReciclaje",
  verificarToken,
  upload.fields([
    { name: 'foto_1', maxCount: 1 },
    { name: 'foto_2', maxCount: 1 },
    { name: 'foto_3', maxCount: 1 },
    { name: 'foto_4', maxCount: 1 },
    { name: 'foto_5', maxCount: 1 }
  ]),
  crearReciclaje);

export default router;