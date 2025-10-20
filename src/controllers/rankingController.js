import turso from "../models/db.js";

export const rankingUsuarios = async (req, res) => {
  try {
    // Consulta para obtener los 3 usuarios con mayor puntaje
    const result = await turso.execute(`
      SELECT nombre, puntos
      FROM usuario
      ORDER BY puntos DESC
      LIMIT 3;
    `);

    // Retorna los datos en formato JSON
    res.status(200).json({
      mensaje: "Ranking obtenido correctamente",
      ranking: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener el ranking de usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el ranking de usuarios",
    });
  }
};
