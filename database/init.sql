-- Script de inicialización de la base de datos
-- Proyecto: Lista de tareas
-- Base de datos: lista_tareas_db
-- PostgreSQL 17

CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_titulo_no_vacio
        CHECK (LENGTH(TRIM(titulo)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_tareas_completada
ON tareas (completada);