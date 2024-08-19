import mysqlPool from "../config/mysqlConnect.js";

const tablePalestrante = `
create table if not exists palestrantes (
    id varchar(60) PRIMARY KEY,
    nome varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    telefone varchar(255) NOT NULL,
    empresa varchar(255) DEFAULT NULL,
    expertise varchar(255) NOT NULL,
    trabalhos_recentes varchar(500) NOT NULL,
    imagem varchar(255),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
    );
`

mysqlPool.query(tablePalestrante, (err) => {
    if (err) throw err;
    console.log("Tabela Palestrantes criada!");
});
