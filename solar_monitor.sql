-- -- =====================================
-- -- BASE DE DATOS MONITOR SOLAR
-- -- =====================================

-- CREATE DATABASE IF NOT EXISTS solar_monitor;

-- USE solar_monitor;

-- -- =====================================
-- -- TABLA PRINCIPAL
-- -- =====================================

-- CREATE TABLE monitoreo_baterias (

-- id INT AUTO_INCREMENT PRIMARY KEY,

-- dispositivo VARCHAR(100) NOT NULL,

-- voltaje FLOAT NOT NULL,

-- corriente FLOAT NOT NULL,

-- estado VARCHAR(20) DEFAULT 'NORMAL',

-- fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- );

-- -- Crear tabla de usuarios
-- CREATE TABLE IF NOT EXISTS usuarios (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nombre TEXT NOT NULL UNIQUE,
--     contraseña TEXT NOT NULL
-- );

-- -- Insertar un usuario de prueba
-- INSERT INTO usuarios (nombre, contraseña) VALUES ('admin', '12345');


-- INSERT INTO monitoreo_baterias (dispositivo, voltaje, corriente, estado) VALUES
-- ('ESP8266_PANEL1', 12.6, 1.2, 'NORMAL'),
-- ('ESP8266_PANEL1', 12.4, 1.0, 'NORMAL'),
-- ('ESP8266_PANEL1', 12.2, 0.8, 'NORMAL'),
-- ('ESP8266_PANEL1', 11.9, 0.6, 'BAJO'),
-- ('ESP8266_PANEL1', 11.7, 0.5, 'BAJO'),
-- ('ESP8266_PANEL1', 12.8, 1.5, 'CARGANDO'),
-- ('ESP8266_PANEL1', 13.1, 1.8, 'CARGANDO'),
-- ('ESP8266_PANEL1', 13.4, 2.0, 'CARGANDO'),
-- ('ESP8266_PANEL1', 12.9, 1.6, 'NORMAL'),
-- ('ESP8266_PANEL1', 12.5, 1.3, 'NORMAL'),
-- ('ESP8266_PANEL1', 12.1, 0.9, 'NORMAL'),
-- ('ESP8266_PANEL1', 11.8, 0.7, 'BAJO'),
-- ('ESP8266_PANEL1', 11.6, 0.4, 'BAJO'),
-- ('ESP8266_PANEL1', 12.7, 1.4, 'CARGANDO'),
-- ('ESP8266_PANEL1', 13.2, 1.9, 'CARGANDO');

-- =====================================
-- TABLA PRINCIPAL
-- =====================================

CREATE TABLE IF NOT EXISTS monitoreo_baterias (

id INT AUTO_INCREMENT PRIMARY KEY,

dispositivo VARCHAR(100) NOT NULL,

voltaje FLOAT NOT NULL,

corriente FLOAT NOT NULL,

estado VARCHAR(20) DEFAULT 'NORMAL',

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- TABLA USUARIOS
-- =====================================

CREATE TABLE IF NOT EXISTS usuarios (

id INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(50) NOT NULL UNIQUE,

contrasena VARCHAR(255) NOT NULL

);

-- =====================================
-- USUARIO ADMIN
-- =====================================

INSERT INTO usuarios (nombre, contrasena)
VALUES ('admin', '12345');

-- =====================================
-- DATOS DE PRUEBA MONITOR
-- =====================================

INSERT INTO monitoreo_baterias (dispositivo, voltaje, corriente, estado) VALUES
('ESP8266_PANEL1', 12.6, 1.2, 'NORMAL'),
('ESP8266_PANEL1', 12.4, 1.0, 'NORMAL'),
('ESP8266_PANEL1', 12.2, 0.8, 'NORMAL'),
('ESP8266_PANEL1', 11.9, 0.6, 'BAJO'),
('ESP8266_PANEL1', 11.7, 0.5, 'BAJO'),
('ESP8266_PANEL1', 12.8, 1.5, 'CARGANDO'),
('ESP8266_PANEL1', 13.1, 1.8, 'CARGANDO'),
('ESP8266_PANEL1', 13.4, 2.0, 'CARGANDO'),
('ESP8266_PANEL1', 12.9, 1.6, 'NORMAL'),
('ESP8266_PANEL1', 12.5, 1.3, 'NORMAL'),
('ESP8266_PANEL1', 12.1, 0.9, 'NORMAL'),
('ESP8266_PANEL1', 11.8, 0.7, 'BAJO'),
('ESP8266_PANEL1', 11.6, 0.4, 'BAJO'),
('ESP8266_PANEL1', 12.7, 1.4, 'CARGANDO'),
('ESP8266_PANEL1', 13.2, 1.9, 'CARGANDO');