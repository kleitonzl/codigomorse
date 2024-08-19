
export const validateFeedback = (req, res, next) => {
  const { eventoId, participanteId, nota, comentario } = req.body;

  if (!eventoId || !participanteId || !nota || !comentario) {
    res.status(400).json({ message: "Todos os campos são obrigatórios!." });
  }

  next();
};
