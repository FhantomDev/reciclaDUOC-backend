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
    const { id } = req.usuario;
    const { nombre, puntos } = req.body;

    // Si no hay campos, devolver error
    if (nombre === undefined && puntos === undefined) {
      return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar" });
    }

    // Construir dinámicamente query
    const campos = [];
    const valores = [];

    if (nombre !== undefined) {
      campos.push("nombre = ?");
      valores.push(nombre);
    }

    if (puntos !== undefined) {
      campos.push("puntos = ?");
      valores.push(puntos);
    }

    valores.push(id); // id para el WHERE

    const sql = `UPDATE usuario SET ${campos.join(", ")} WHERE id_usuario = ?`;

    await turso.execute({
      sql,
      args: valores,
    });

    // Obtener perfil actualizado
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

