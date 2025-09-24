-- Script para crear la tabla de fotos de items individuales (FLVEH_F002)
-- Esta tabla almacenará las fotos opcionales de cada item revisado

CREATE TABLE IF NOT EXISTS FLVEHI.FLVEH_F002 (
    id_foto_item INT AUTO_INCREMENT PRIMARY KEY,
    id_hoja INT NOT NULL,
    id_check INT NOT NULL,
    id_empresa INT NOT NULL DEFAULT 1,
    tipo_hoja CHAR(1) NOT NULL DEFAULT 'S',
    foto LONGBLOB NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    fe_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fe_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado VARCHAR(10) NOT NULL DEFAULT 'ING',
    nombre_archivo VARCHAR(255),
    tamano_archivo INT,
    tipo_mime VARCHAR(50),
    INDEX idx_id_hoja (id_hoja),
    INDEX idx_id_check (id_check),
    INDEX idx_estado (estado),
    FOREIGN KEY (id_hoja) REFERENCES FLVEHI.FLVEH_T001(id_hoja) ON DELETE CASCADE,
    FOREIGN KEY (id_check) REFERENCES FLVEHI.FLVEH_M007(id_check) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios de la tabla
ALTER TABLE FLVEHI.FLVEH_F002 COMMENT = 'Tabla de fotos de items individuales revisados';

-- Comentarios de las columnas
ALTER TABLE FLVEHI.FLVEH_F002 
MODIFY COLUMN id_foto_item INT AUTO_INCREMENT COMMENT 'Secuencia de la foto del item',
MODIFY COLUMN id_hoja INT NOT NULL COMMENT 'ID de Hoja que traes desde inicio',
MODIFY COLUMN id_check INT NOT NULL COMMENT 'ID del item de checklist revisado',
MODIFY COLUMN id_empresa INT NOT NULL DEFAULT 1 COMMENT 'ID Empresa',
MODIFY COLUMN tipo_hoja CHAR(1) NOT NULL DEFAULT 'S' COMMENT 'Tipo de hoja (S=Salida)',
MODIFY COLUMN foto LONGBLOB NOT NULL COMMENT 'La foto del item que ingresaron',
MODIFY COLUMN id_usuario VARCHAR(50) NOT NULL COMMENT 'ID Usuario',
MODIFY COLUMN fe_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del registro',
MODIFY COLUMN fe_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha modificacion',
MODIFY COLUMN estado VARCHAR(10) NOT NULL DEFAULT 'ING' COMMENT 'Estado de la foto',
MODIFY COLUMN nombre_archivo VARCHAR(255) COMMENT 'Nombre original del archivo',
MODIFY COLUMN tamano_archivo INT COMMENT 'Tamaño del archivo en bytes',
MODIFY COLUMN tipo_mime VARCHAR(50) COMMENT 'Tipo MIME del archivo';

