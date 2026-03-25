CREATE DATABASE IF NOT EXISTS proyecto_rol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE proyecto_rol;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campana (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descripcion TEXT,
    mapa_url VARCHAR(255) DEFAULT NULL,
    codigo_invitacion VARCHAR(20) NOT NULL UNIQUE,
    id_master INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_master) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE participa (
    id_campana INT NOT NULL,
    id_usuario INT NOT NULL,
    rol ENUM('master', 'jugador') NOT NULL DEFAULT 'jugador',
    PRIMARY KEY (id_campana, id_usuario),
    FOREIGN KEY (id_campana) REFERENCES campana(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE invitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_campana INT NOT NULL,
    id_usuario INT NOT NULL,
    estado ENUM('pendiente', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_campana) REFERENCES campana(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE personaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255) DEFAULT NULL,
    es_npc BOOLEAN NOT NULL DEFAULT FALSE,
    id_usuario INT NOT NULL,
    id_campana INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_campana) REFERENCES campana(id) ON DELETE SET NULL
);

CREATE TABLE ficha (
    id_personaje INT PRIMARY KEY,
    sistema VARCHAR(80) NOT NULL,
    datos JSON NOT NULL,
    FOREIGN KEY (id_personaje) REFERENCES personaje(id) ON DELETE CASCADE
);

CREATE TABLE tirada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formula VARCHAR(50) NOT NULL,
    resultado_total INT NOT NULL,
    detalle_dados JSON,
    id_usuario INT NOT NULL,
    id_personaje INT DEFAULT NULL,
    id_campana INT DEFAULT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_personaje) REFERENCES personaje(id) ON DELETE SET NULL,
    FOREIGN KEY (id_campana) REFERENCES campana(id) ON DELETE SET NULL
);