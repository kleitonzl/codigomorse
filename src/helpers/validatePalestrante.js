import validator from "validator";

export const validatePalestrante = (req, res, next) => {
  const {
    nome,
    email,
    telefone,
    empresa,
    expertise,
    trabalhos_recentes,
    imagem,
  } = req.body;

  if (
    !nome ||
    !email ||
    !telefone ||
    !empresa ||
    !expertise ||
    !trabalhos_recentes ||
    !imagem
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
