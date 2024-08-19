import validator from "validator";

export const validateParticipante = (req, res, next) => {
  const { nome, email, telefone, imagem, cpf } = req.body;

  if (!nome || !email || !telefone || !imagem || !cpf) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "O email fornecido é inválido!" });
  }

  next();
};
