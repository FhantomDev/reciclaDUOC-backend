import express from "express";
import usuariosRoutes from "./routes/usuarios.js";
import reciclajeRoutes from "./routes/reciclaje.js";
import 'dotenv/config';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Rutas
app.use("/api/usuario", usuariosRoutes);
app.use("/api/reciclaje", reciclajeRoutes);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});