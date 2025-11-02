import express from "express";
import usuariosRoutes from "./routes/usuarios.js";
import reciclajeRoutes from "./routes/reciclaje.js";
import materialRoutes from "./routes/material.js";
import 'dotenv/config';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// Rutas
app.use("/api/usuario", usuariosRoutes);
app.use("/api/reciclaje", reciclajeRoutes);
app.use("/api/material", materialRoutes);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});