import turso from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ error: "Email y password son obligatorios" });
  }

  try {
    // Buscar usuario
    const result = await turso.execute({
      sql: "SELECT * FROM usuario WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];

    // Comparar contraseña
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      SECRET_KEY,
      { expiresIn: "5h" }
    );

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};