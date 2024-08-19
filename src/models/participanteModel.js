import mysqlPool from "../config/mysqlConnect.js";

const tableUsers = `
    CREATE TABLE IF NOT EXISTS usuarios(
        id varchar(60) PRIMARY KEY,
        nome varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        telefone varchar(255) NOT NULL,
        imagem varchar(255),
        cpf varchar(11) NOT NULL,
        created_at timestamp default CURRENT_TIMESTAMP,
        updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
    )
`;

const tableEventosParticipantes =  `
    CREATE TABLE IF NOT EXISTS eventos_usuarios (
    eventoId VARCHAR(60),
    userId VARCHAR(60),
    PRIMARY KEY (eventoId, userId),
    FOREIGN KEY (eventoId) REFERENCES eventos(id),
    FOREIGN KEY (userId) REFERENCES usuarios(id)
);
`

mysqlPool.query(tableUsers, (err) => {
    if (err) throw err;
    console.log("Tabela Usuarios criada!");
});

mysqlPool.query(tableEventosParticipantes, (err) => {
    if (err) throw err;
    console.log("Tabela Eventos pra Usuarios criada!");
});
