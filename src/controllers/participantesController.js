import mysqlPool from "../config/mysqlConnect.js";
import { handleError } from "../helpers/error.js";
import { v4 as uuidv4 } from "uuid";

export const createParticipante = (req, res) => {
  const { nome, email, telefone, imagem, cpf } = req.body;

  mysqlPool.query(
    "SELECT email, cpf FROM usuarios WHERE email = ? and cpf = ?",
    [email, cpf],
    (err, result) => {
      if (err) return handleError(res, err, "Erro ao criar participante.");
      if (result.length > 0) {
        return res
          .status(409)
          .json({
            message:
              "Já existe um participante cadastrado com esse email ou CPF.",
          });
      }

      const id = uuidv4();

      const query = `
            INSERT INTO usuarios (id, nome, email, telefone, imagem, cpf) VALUES (?, ?, ?, ?, ?, ?)
        `;

      mysqlPool.query(
        query,
        [id, nome, email, telefone, imagem, cpf],
        (err, result) => {
          if (err)
            return handleError(
              res,
              err,
              "Erro ao tentar criar um participante"
            );
          res
            .status(201)
            .json({ message: "Pariticpante criado com sucesso", id });
        }
      );
    }
  );
};

export const getParticipantes = (req, res) => {
  const query = "SELECT nome, email, telefone, imagem, cpf FROM usuarios";

  mysqlPool.query(query, (err, results) => {
    if (err) return handleError(res, err, "Erro ao listar participantes.");
    res.status(200).json(results);
  });
};
