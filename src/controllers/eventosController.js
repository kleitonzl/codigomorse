import mysqlPool from "../config/mysqlConnect.js";
import { handleError } from "../helpers/error.js";
import { v4 as uuidv4 } from "uuid";

export const createEvento = (req, res) => {
  const {
    titulo,
    data,
    descricao_evento,
    categoria,
    rede_social,
    email,
    palestrantesId,
  } = req.body;

  const checkQuery = `
        SELECT id FROM eventos WHERE titulo = ? AND data = ?
    `;

  mysqlPool.query(checkQuery, [titulo, data], (err, results) => {
    if (err)
      return handleError(res, err, "Erro ao verificar evento existente.");
    if (results.length > 0) {
      return res
        .status(409)
        .json({ message: "Já existe um evento com esse título e data!" });
    }

    const id = uuidv4();
    const insertQuery = `
            INSERT INTO eventos (id, titulo, data, descricao_evento, categoria, rede_social, email, palestrantesId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    mysqlPool.query(
      insertQuery,
      [
        id,
        titulo,
        data,
        descricao_evento,
        categoria,
        rede_social,
        email,
        palestrantesId || null,
      ],
      (err, result) => {
        if (err) return handleError(res, err, "Erro ao criar evento.");
        res.status(201).json({ message: "Evento criado com sucesso.", id });
      }
    );
  });
};

export const getEventos = (req, res) => {
  const query =
    "SELECT titulo, data, descricao_evento, categoria, rede_social, email FROM eventos";

  mysqlPool.query(query, (err, results) => {
    if (err) return handleError(res, err, "Erro ao listar eventos.");
    res.status(200).json(results);
  });
};

// NÃO FUNCIONA A AGENDA, EU TENTEI COM AUXILIO DE CODIGOS DA API DO ONIBUS, MAS INFELIZMENTE FALTOU CONHECIMENTO. DESCULPE DECEPCIONA-LO.

export const getAgendaEventos = (req, res) => {
  const query = `
        SELECT e.titulo, e.data, e.descricao_evento, e.categoria, e.rede_social, e.email, 
               p.nome, p.email AS palestrante_email, p.telefone, p.empresa, p.expertise, 
               p.trabalhos_recentes, p.imagem 
        FROM eventos AS e
        INNER JOIN eventos_palestrantes AS ep ON e.id = ep.eventoId
        INNER JOIN palestrantes AS p ON ep.palestranteId = p.id
    `;

  mysqlPool.query(query, (err, results) => {
    if (err)
      return handleError(
        res,
        err,
        "Erro ao tentar listar os eventos com detalhes dos palestrantes."
      );

    const formattedResults = results.reduce((acc, result) => {
      const eventoIndex = acc.findIndex(
        (ev) => ev.titulo === result.titulo && ev.data === result.data
      );
      if (eventoIndex === -1) {
        acc.push({
          titulo: result.titulo,
          data: result.data,
          descricao: result.descricao_evento,
          categoria: result.categoria,
          rede_social: result.rede_social,
          email: result.email,
          palestrantes: [
            {
              nome: result.nome,
              email: result.palestrante_email,
              telefone: result.telefone,
              empresa: result.empresa,
              expertise: result.expertise,
              trabalhos: result.trabalhos_recentes,
              imagem: result.imagem,
            },
          ],
        });
      } else {
        acc[eventoIndex].palestrantes.push({
          nome: result.nome,
          email: result.palestrante_email,
          telefone: result.telefone,
          empresa: result.empresa,
          expertise: result.expertise,
          trabalhos: result.trabalhos_recentes,
          imagem: result.imagem,
        });
      }
      return acc;
    }, []);

    res.status(200).json(formattedResults);
  });
};

export const createEnrollmentParticipante = (req, res) => {
  const { userId, eventoId } = req.body;

  const query = `
        INSERT INTO eventos_usuarios (userId, eventoId) VALUES (?, ?)
    `;

  mysqlPool.query(query, [userId, eventoId], (err, result) => {
    if (err)
      return handleError(
        res,
        err,
        "Erro ao tentar inscrever o participante no evento."
      );
    const id = uuidv4();
    res.status(201).json({ message: "Participante inscrito com sucesso.", id });
  });
};

export const getEventoMaisPopular = (req, res) => {
  const query = `
        SELECT e.id, e.titulo, e.data, e.descricao_evento, e.categoria, e.rede_social, e.email, 
               COUNT(eu.userId) AS num_participantes
        FROM eventos AS e
        LEFT JOIN eventos_usuarios AS eu ON e.id = eu.eventoId
        GROUP BY e.id
        ORDER BY num_participantes DESC
        LIMIT 1
    `;

  mysqlPool.query(query, (err, results) => {
    if (err)
      return handleError(
        res,
        err,
        "Erro ao tentar listar o evento mais popular."
      );
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum evento encontrado." });
    }
    res.status(200).json(results[0]);
  });
};

export const getPalestranteMaisAtivo = (req, res) => {
  const query = `
        SELECT p.id, p.nome, p.email, p.telefone, p.empresa, p.expertise, 
               p.trabalhos_recentes, p.imagem, COUNT(ep.eventoId) AS num_eventos
        FROM palestrantes AS p
        INNER JOIN eventos_palestrantes AS ep ON p.id = ep.palestranteId
        GROUP BY p.id
        ORDER BY num_eventos DESC
        LIMIT 1
    `;

  mysqlPool.query(query, (err, results) => {
    if (err)
      return handleError(
        res,
        err,
        "Erro ao tentar listar o palestrante mais ativo."
      );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum palestrante encontrado." });
    }
    res.status(200).json(results[0]);
  });
};

export const getMeusEventos = (req, res) => {
  const { participanteId } = req.query;

  if (!participanteId) {
    return res
      .status(400)
      .json({ message: "Parâmetro participanteId é obrigatório." });
  }

  const query = `
        SELECT e.id, e.titulo, e.data, e.descricao_evento, e.categoria, e.rede_social, e.email
        FROM eventos AS e
        INNER JOIN eventos_usuarios AS eu ON e.id = eu.eventoId
        WHERE eu.userId = ?
    `;

  mysqlPool.query(query, [participanteId], (err, results) => {
    if (err)
      return handleError(
        res,
        err,
        "Erro ao listar os eventos do participante."
      );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum evento encontrado para este participante." });
    }
    res.status(200).json(results);
  });
};

export const updateEvento = (req, res) => {
    const { eventoId, titulo, data, descricao_evento, categoria, rede_social, email, palestrantesId } = req.body;

    if (!eventoId) {
        return res.status(400).json({ message: "ID do evento é obrigatório." });
    }

    const checkEventQuery = "SELECT id FROM eventos WHERE id = ?";
    mysqlPool.query(checkEventQuery, [eventoId], (err, results) => {
        if (err) return handleError(res, err, "Erro ao verificar evento.");
        if (results.length === 0) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        const updateEventQuery = `
            UPDATE eventos
            SET titulo = ?, data = ?, descricao_evento = ?, categoria = ?, rede_social = ?, email = ?
            WHERE id = ?
        `;

        mysqlPool.query(updateEventQuery, [titulo, data, descricao_evento, categoria, rede_social, email, eventoId], (err) => {
            if (err) return handleError(res, err, "Erro ao atualizar o evento.");

            if (palestrantesId && palestrantesId.length > 0) {
                const deletePalestrantesQuery = "DELETE FROM eventos_palestrantes WHERE eventoId = ?";

                mysqlPool.query(deletePalestrantesQuery, [eventoId], (err) => {
                    if (err) return handleError(res, err, "Erro ao remover palestrantes existentes.");

                    const insertPalestrantesQuery = `
                        INSERT INTO eventos_palestrantes (eventoId, palestranteId)
                        VALUES ?
                    `;
                    
                    const values = palestrantesId.map(id => [eventoId, id]);
                    mysqlPool.query(insertPalestrantesQuery, [values], (err) => {
                        if (err) return handleError(res, err, "Erro ao associar palestrantes ao evento.");

                        res.status(200).json({ message: "Evento atualizado com sucesso." });
                    });
                });
            } else {
                res.status(200).json({ message: "Evento atualizado com sucesso." });
            }
        });
    });
};

export const cancelEventos = (req, res) => {
  const { id } = req.params;

  mysqlPool.query(
    "DELETE FROM eventos WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return handleError(res, error, "Erro ao tentar deletar o evento!");
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Evento não encontrado!" });
      }
      res.status(200).json({ message: "Evento deletado com sucesso!" });
    }
  );
};
