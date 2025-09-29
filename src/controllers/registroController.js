import turso from "../models/db.js";
import bcrypt from "bcrypt";

export const registrarUsuario = async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: "Email, password y nombre son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const existe = await turso.execute({
      sql: "SELECT * FROM usuario WHERE email = ?",
      args: [email],
    });

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const nuevo = await turso.execute({
      sql: "INSERT INTO usuario (email, password, nombre) VALUES (?, ?, ?)",
      args: [email, hashedPassword, nombre],
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: Number(nuevo.lastInsertRowid),
        email,
        nombre
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
