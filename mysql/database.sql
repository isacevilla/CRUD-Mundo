CREATE DATABASE perfume_store;

USE perfume_store;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    primeiro_login BOOLEAN DEFAULT TRUE,
    tentativas_login INT DEFAULT 0,
    status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, primeiro_login, status) VALUES ('Administrador', 'admin@perfume.com', 'admin123', FALSE, 'ativo');

SELECT * FROM usuarios;