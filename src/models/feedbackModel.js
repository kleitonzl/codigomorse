import mysqlPool from "../config/mysqlConnect.js";

const tableFeedback = `
    CREATE TABLE IF NOT EXISTS feedback_eventos (
        id varchar(60) PRIMARY KEY,
        eventoId varchar(60) NOT NULL,
        participanteId varchar(60) NOT NULL,
        nota INT NOT NULL,
        comentario varchar(255) NOT NULL,


        FOREIGN KEY (eventoId) REFERENCES eventos(id),
        FOREIGN KEY (participanteId) REFERENCES usuarios(id)
    )
`

mysqlPool.query(tableFeedback, (err) => {
    if (err) throw err;
    console.log("Tabela Feedback criada!");
});

