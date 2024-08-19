import mysqlPool from "../config/mysqlConnect.js";
import { v4 as uuidv4 } from "uuid";
import { handleError } from "../helpers/error.js";

export const createPalestrante = async (req, res) => {
  const {
    nome,
    email,
    telefone,
    empresa,
    expertise,
    trabalhos_recentes,
    imagem,
  } = req.body;

  mysqlPool.query(
    "SELECT email from palestrantes WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return handleError(res, err, "Erro ao criar palestrante.");
      if (results.length > 0) {
        res
          .status(409)
          .json({
            message:
              "O email do palestrante já existe na base de dados!. Tente outro email.",
          });
      }

      const id = uuidv4();

      const query = `
        INSERT INTO palestrantes (id, nome, email, telefone, empresa, expertise, trabalhos_recentes, imagem) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

      mysqlPool.query(
        query,
        [
          id,
          nome,
          email,
          telefone,
          empresa,
          expertise,
          trabalhos_recentes,
          imagem,
        ],
        (err, result) => {
          if (err)
            return handleError(
              res,
              err,
              "Erro ao tentar criar um palestrante!."
            );
          res
            .status(201)
            .json({ message: "Palestrante criado com sucesso", id });
        }
      );
    }
  );
};

export const getPalestrantes = (req, res) => {
  const query =
    "SELECT nome, email, telefone, empresa, expertise, trabalhos_recentes FROM palestrantes";

  mysqlPool.query(query, (err, results) => {
    if (err) return handleError(res, err, "Erro ao listar palestrantes.");
    res.status(200).json(results);
  });
};
