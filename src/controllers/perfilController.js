import turso from "../models/db.js";

// Controlador para obtener el perfil del usuario
export const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.usuario;

    // Datos del usuario
    const userResult = await turso.execute({
      sql: `
        SELECT id_usuario, email, nombre, puntos
        FROM usuario
        WHERE id_usuario = ?
      `,
      args: [id],
    });

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = userResult.rows[0];

    // Reciclajes realizados por el usuario
    const reciclajesResult = await turso.execute({
      sql: `
        SELECT r.id_reciclaje, r.fecha, r.foto, rp.cantidad,
               p.id_producto, p.nombre AS producto, p.descripcion, p.valor_punto
        FROM reciclaje r
        JOIN reciclaje_producto rp ON r.id_reciclaje = rp.id_reciclaje
        JOIN producto p ON rp.id_producto = p.id_producto
        WHERE r.id_usuario = ?
        ORDER BY r.fecha DESC
      `,
      args: [id],
    });

    // Agrupar reciclajes y sus productos
    const reciclajesMap = {};
    reciclajesResult.rows.forEach((row) => {
      if (!reciclajesMap[row.id_reciclaje]) {
        reciclajesMap[row.id_reciclaje] = {
          id_reciclaje: row.id_reciclaje,
          fecha: row.fecha,
          foto: row.foto,
          productos: [],
        };
      }
      reciclajesMap[row.id_reciclaje].productos.push({
        id_producto: row.id_producto,
        nombre: row.producto,
        descripcion: row.descripcion,
        valor_punto: row.valor_punto,
        cantidad: row.cantidad,
      });
    });

    const reciclajes = Object.values(reciclajesMap);

    res.status(200).json({
      mensaje: "Perfil obtenido correctamente",
      perfil: usuario,
      reciclajes,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Nuevo controlador para actualizar el perfil
export const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.usuario; // viene del token
    const { nombre, puntos } = req.body;

    if (!nombre && puntos === undefined) {
      return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar" });
    }

    await turso.execute({
      sql: `
        UPDATE usuario
        SET nombre = COALESCE(?, nombre),
            puntos = COALESCE(?, puntos)
        WHERE id_usuario = ?
      `,
      args: [nombre, puntos, id],
    });

    const actualizado = await turso.execute({
      sql: `
        SELECT id_usuario, email, nombre, puntos
        FROM usuario
        WHERE id_usuario = ?
      `,
      args: [id],
    });

    res.status(200).json({
      mensaje: "Perfil actualizado correctamente",
      perfil: actualizado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};