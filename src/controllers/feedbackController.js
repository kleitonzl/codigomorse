import mysqlPool from "../config/mysqlConnect.js";
import { handleError } from "../helpers/error.js";
import { v4 as uuidv4 } from "uuid";

export const CreatefeedbackUsers = (req, res) => {
  const { eventoId, participanteId, nota, comentario } = req.body;
  
  if (typeof nota !== 'number' || nota < 0 || nota > 5) {
    return res.status(400).json({ message: "Nota deve ser um número entre 0 e 5." });
  }

  const id = uuidv4();
  const insertQuery = `
        INSERT INTO feedback_eventos (id, eventoId, participanteId, nota, comentario) 
        VALUES (?, ?, ?, ?, ?)
    `;

  mysqlPool.query(
    insertQuery,
    [id, eventoId, participanteId, nota, comentario],
    (err, result) => {
      if (err) return handleError(res, err, "Erro ao criar o feedback.");
      
      res.status(201).json({ message: "Feedback criado com sucesso.", id });
    }
  );
};

export const getFeedbackUsers = (req, res) => {
  const query = `SELECT nota, comentario FROM feedback_eventos`;

  mysqlPool.query(query, (err, results) => {
    if (err) return handleError(res, err, "Erro ao tentar listar os feedback");
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum feedback encontrado." });
    }
    res.status(200).json(results);
  });
};
