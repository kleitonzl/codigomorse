import mysqlPool from "../config/mysqlConnect.js";

const tableEventos =  
    `CREATE TABLE IF NOT EXISTS eventos (
    id VARCHAR(60) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    descricao_evento VARCHAR(400),
    categoria VARCHAR(255),
    rede_social varchar(255),
    email varchar(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    palestrantesId varchar(60),

    FOREIGN KEY (palestrantesId) REFERENCES palestrantes(id)
);
`

const tableEventosPalestrantes = 
    `CREATE TABLE IF NOT EXISTS eventos_palestrantes (
    eventoId VARCHAR(60),
    palestranteId VARCHAR(60),
    PRIMARY KEY (eventoId, palestranteId),
    FOREIGN KEY (eventoId) REFERENCES eventos(id),
    FOREIGN KEY (palestranteId) REFERENCES palestrantes(id)
);
`

mysqlPool.query(tableEventos, (err) => {
    if (err) throw err;
    console.log("Tabela Eventos criada!");
});


mysqlPool.query(tableEventosPalestrantes, (err) => {
    if (err) throw err;
    console.log("Tabela Eventos para Palestrantes criada!");
});