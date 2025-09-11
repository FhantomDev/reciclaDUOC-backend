import express from "express";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Rutas
app.use("/usuarios", usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});