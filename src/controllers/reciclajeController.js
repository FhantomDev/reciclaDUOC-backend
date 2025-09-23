import turso from "../models/db.js";

export const crearReciclaje = async (req, res) => {
  try {
    const { id_deposito, productos, foto } = req.body;
    const { id: id_usuario } = req.usuario;

    // Validar datos requeridos
    if (!id_deposito || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: "Datos incompletos. Se requiere id_deposito y al menos un producto"
      });
    }

    // Validar estructura de productos
    for (const producto of productos) {
      if (!producto.id_producto || !producto.cantidad || producto.cantidad <= 0) {
        return res.status(400).json({
          error: "Estructura de productos inválida. Cada producto debe tener id_producto y cantidad mayor a 0"
        });
      }
    }

    // Obtener fecha actual
    const fecha = new Date().toISOString();

    // Insertar el reciclaje
    const resultReciclaje = await turso.execute({
      sql: `
        INSERT INTO reciclaje (id_usuario, id_deposito, fecha, foto)
        VALUES (?, ?, ?, ?)
        RETURNING id_reciclaje
      `,
      args: [id_usuario, id_deposito, fecha, foto || null]
    });

    const id_reciclaje = resultReciclaje.rows[0].id_reciclaje;

    // Insertar productos del reciclaje
    for (const producto of productos) {
      await turso.execute({
        sql: `
          INSERT INTO reciclaje_producto (id_reciclaje, id_producto, cantidad)
          VALUES (?, ?, ?)
        `,
        args: [id_reciclaje, producto.id_producto, producto.cantidad]
      });
    }

    // Calcular y actualizar puntos del usuario
    const puntosQuery = await turso.execute({
      sql: `
        SELECT SUM(p.valor_punto * rp.cantidad) as puntos_ganados
        FROM reciclaje_producto rp
        JOIN producto p ON rp.id_producto = p.id_producto
        WHERE rp.id_reciclaje = ?
      `,
      args: [id_reciclaje]
    });

    const puntosGanados = puntosQuery.rows[0].puntos_ganados || 0;

    // Actualizar puntos del usuario
    await turso.execute({
      sql: `
        UPDATE usuario 
        SET puntos = puntos + ? 
        WHERE id_usuario = ?
      `,
      args: [puntosGanados, id_usuario]
    });

    // Obtener el reciclaje completo para la respuesta
    const reciclaje = {
      id_reciclaje,
      fecha,
      foto,
      productos: await Promise.all(productos.map(async (p) => {
        const productoInfo = await turso.execute({
          sql: `
            SELECT nombre, descripcion, valor_punto
            FROM producto
            WHERE id_producto = ?
          `,
          args: [p.id_producto]
        });
        return {
          ...productoInfo.rows[0],
          id_producto: p.id_producto,
          cantidad: p.cantidad
        };
      })),
      puntos_ganados: puntosGanados
    };

    res.status(201).json({
      mensaje: "Reciclaje registrado correctamente",
      reciclaje
    });

  } catch (error) {
    console.error("Error al crear reciclaje:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
