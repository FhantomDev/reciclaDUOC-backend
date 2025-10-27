-- ==============================================
-- ELIMINACIÓN DE TABLAS
-- ==============================================

DROP TABLE IF EXISTS reciclaje_material;
DROP TABLE IF EXISTS reciclaje;
DROP TABLE IF EXISTS deposito;
DROP TABLE IF EXISTS centro;
DROP TABLE IF EXISTS comuna;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS material;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS premio;


-- ==============================================
-- CREACIÓN DE TABLAS
-- ==============================================
CREATE TABLE premio (
    id_premio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    foto VARCHAR(200),
    puntos_requeridos INTEGER NOT NULL
    stock INTEGER NOT NULL
);


CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    puntos INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE canje_premio (
    id_canje INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_premio INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_premio) REFERENCES premio(id_premio)
);

CREATE TABLE rol (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL
);

CREATE TABLE material (
    id_material INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    valor_punto INTEGER NOT NULL
);

CREATE TABLE region (
    id_region INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(30)
);

CREATE TABLE comuna (
    id_comuna INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(30) NOT NULL,
    id_region INTEGER NOT NULL,
    FOREIGN KEY (id_region) REFERENCES region(id_region)
);

CREATE TABLE centro (
    id_centro INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(30) NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    id_comuna INTEGER NOT NULL,
    latitud DECIMAL NOT NULL,
    longitud DECIMAL NOT NULL,
    FOREIGN KEY (id_comuna) REFERENCES comuna(id_comuna)
);

CREATE TABLE deposito (
    id_deposito INTEGER PRIMARY KEY AUTOINCREMENT,
    ubicacion VARCHAR(30) NOT NULL,
    id_centro INTEGER NOT NULL,
    FOREIGN KEY (id_centro) REFERENCES centro(id_centro)
);

CREATE TABLE reciclaje (
    id_reciclaje INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_deposito INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_deposito) REFERENCES deposito(id_deposito)
);

CREATE TABLE reciclaje_material (
    id_reciclaje INTEGER NOT NULL,
    id_material INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    foto VARCHAR(100),
    PRIMARY KEY (id_reciclaje, id_material),
    FOREIGN KEY (id_reciclaje) REFERENCES reciclaje(id_reciclaje),
    FOREIGN KEY (id_material) REFERENCES material(id_material)
);

-- ==============================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- ==============================================
-- Roles
INSERT INTO rol (nombre) VALUES
('Administrador'),
('Usuario');

-- Materiales
INSERT INTO material (nombre, valor_punto) VALUES
('Plástico', 10),
('Vidrio', 15);

-- Regiones
INSERT INTO region (nombre) VALUES
('Metropolitana'),
('Valparaíso');

-- Comunas
INSERT INTO comuna (nombre, id_region) VALUES
('Providencia', 1),
('Viña del Mar', 2);

-- Centros
INSERT INTO centro (nombre, direccion, id_comuna, latitud, longitud) VALUES
('Sede Antonio Varas', 'Antonio Varas 666', 1, -33.4489, -70.6693),
('Sede Viña del mar', 'Álvarez 2366', 2, -33.0245, -71.5518);

-- Depósitos
INSERT INTO deposito (ubicacion, id_centro) VALUES
('Estación Central', 1),
('Playa Acapulco', 2);

-- Reciclajes
INSERT INTO reciclaje (id_usuario, id_deposito, fecha, foto) VALUES
(1, 1, '2025-09-17 10:00:00', 'foto1.jpg'),
(2, 2, '2025-09-17 11:30:00', 'foto2.jpg');

-- Reciclaje_Material
INSERT INTO reciclaje_material (id_reciclaje, id_material, cantidad, foto) VALUES
(1, 1, 5, 'foto1_material.jpg'),
(2, 2, 3, 'foto2_material.jpg');