import turso from "../models/db.js";
import supabase from "../models/supabase.js";

export const crearReciclaje = async (req, res) => {
  try {
    const { id_deposito, materiales } = req.body;
    const { id: id_usuario } = req.usuario;

    // Validar datos requeridos
    if (!id_deposito || !materiales || !Array.isArray(materiales) || materiales.length === 0) {
      return res.status(400).json({
        error: "Datos incompletos. Se requiere id_deposito y al menos un material"
      });
    }

    // Validar estructura de materiales
    for (const material of materiales) {
      if (!material.id_material || !material.cantidad || material.cantidad <= 0) {
        return res.status(400).json({
          error: "Estructura de materiales inválida. Cada material debe tener id_material y cantidad mayor a 0"
        });
      }
    }

    // Obtener fecha actual
    const fecha = new Date().toISOString();

    // Insertar el reciclaje primero para obtener el ID
    const resultReciclaje = await turso.execute({
      sql: `
        INSERT INTO reciclaje (id_usuario, id_deposito, fecha)
        VALUES (?, ?, ?)
        RETURNING id_reciclaje
      `,
      args: [id_usuario, id_deposito, fecha]
    });

    const id_reciclaje = resultReciclaje.rows[0].id_reciclaje;

    // Insertar materiales del reciclaje
    for (const material of materiales) {
      let urlFoto = null;
      if (material.foto) {
        try {
          const buffer = Buffer.from(material.foto.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const extension = material.foto.match(/data:image\/(\w+);/)[1];
          const nombreArchivo = `reciclaje_${id_reciclaje}_${material.id_material}.${extension}`;

          const { data, error } = await supabase.storage
            .from('reciclaDUOC_fotos')
            .upload(nombreArchivo, buffer, {
              contentType: `image/${extension}`,
              upsert: true
            });

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('reciclaDUOC_fotos')
            .getPublicUrl(nombreArchivo);
          urlFoto = publicUrl;
        } catch (error) {
          console.error("Error al subir la foto:", error);
        }
      }

      await turso.execute({
        sql: `
          INSERT INTO reciclaje_material (id_reciclaje, id_material, cantidad, foto)
          VALUES (?, ?, ?, ?)
        `,
        args: [id_reciclaje, material.id_material, material.cantidad, urlFoto]
      });
    }

    // Calcular y actualizar puntos del usuario
    const puntosQuery = await turso.execute({
      sql: `
        SELECT SUM(m.valor_punto * rm.cantidad) as puntos_ganados
        FROM reciclaje_material rm
        JOIN material m ON rm.id_material = m.id_material
        WHERE rm.id_reciclaje = ?
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
      materiales: await Promise.all(materiales.map(async (m) => {
        const materialInfo = await turso.execute({
          sql: `
            SELECT nombre, valor_punto
            FROM material
            WHERE id_material = ?
          `,
          args: [m.id_material]
        });
        return {
          ...materialInfo.rows[0],
          id_material: m.id_material,
          cantidad: m.cantidad
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
