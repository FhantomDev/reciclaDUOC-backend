import { Router } from "express";
import { crearMaterial } from "../controllers/materialController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /material/registroMaterial
router.post("/registroMaterial", verificarToken, crearMaterial);

export default router;
