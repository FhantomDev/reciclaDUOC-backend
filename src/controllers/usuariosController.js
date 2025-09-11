let usuarios = []; // luego reemplazamos por BD

export const registrarUsuario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y password son obligatorios" });
  }

  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    return res.status(409).json({ error: "El usuario ya existe" });
  }

  const nuevoUsuario = { id: usuarios.length + 1, email, password };
  usuarios.push(nuevoUsuario);

  res.status(201).json({
    mensaje: "Usuario registrado correctamente",
    usuario: nuevoUsuario,
  });
};