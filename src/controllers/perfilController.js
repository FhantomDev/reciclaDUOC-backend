import turso from "../models/db.js";

export const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.usuario; // viene del token gracias al middleware

    const result = await turso.execute({
      sql: `
        SELECT id_usuario, email, nombre, apellido, puntos
        FROM usuario
        WHERE id_usuario = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Perfil obtenido correctamente",
      perfil: result.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
