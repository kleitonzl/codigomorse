import validator from "validator";

export const validateEvento = (req, res, next) => {
  const { titulo, data, descricao_evento, categoria, rede_social, email, palestranteId } =
    req.body;

  if (
    !titulo ||
    !data ||
    !descricao_evento ||
    !categoria ||
    !rede_social ||
    !email ||
    palestranteId === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "O email fornecido é inválido!" });
  }

  next();
};
