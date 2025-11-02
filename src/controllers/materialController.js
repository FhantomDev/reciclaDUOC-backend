import turso from "../models/db.js";

export const crearMaterial = async (req, res) => {
  try {
    const { nombre, valor_punto } = req.body;

    if (!nombre || valor_punto === undefined) {
      return res.status(400).json({ error: "Nombre y valor_punto son obligatorios" });
    }

    const valor = Number(valor_punto);
    if (Number.isNaN(valor) || valor <= 0) {
      return res.status(400).json({ error: "valor_punto debe ser un número mayor a 0" });
    }

    const nuevo = await turso.execute({
      sql: "INSERT INTO material (nombre, valor_punto) VALUES (?, ?)",
      args: [nombre, valor]
    });

    res.status(201).json({
      mensaje: "Material agregado correctamente",
      material: {
        id: Number(nuevo.lastInsertRowid),
        nombre,
        valor_punto: valor
      }
    });
  } catch (error) {
    console.error("Error al crear material:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
