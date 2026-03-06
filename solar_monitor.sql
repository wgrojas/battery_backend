-- =====================================
-- BASE DE DATOS MONITOR SOLAR
-- =====================================

CREATE DATABASE IF NOT EXISTS solar_monitor;

USE solar_monitor;

-- =====================================
-- TABLA PRINCIPAL
-- =====================================

CREATE TABLE monitoreo_baterias (

id INT AUTO_INCREMENT PRIMARY KEY,

dispositivo VARCHAR(100) NOT NULL,

voltaje FLOAT NOT NULL,

corriente FLOAT NOT NULL,

estado VARCHAR(20) DEFAULT 'NORMAL',

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL
);

-- Insertar un usuario de prueba
INSERT INTO usuarios (nombre, contraseña) VALUES ('admin', '12345');