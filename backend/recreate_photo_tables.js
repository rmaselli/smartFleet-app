const mysql = require('mysql2/promise');
require('dotenv').config();

async function recreatePhotoTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Recreando tablas de fotos con estructura correcta...');
    
    // Eliminar y recrear FLVEH_F001
    console.log('\n📋 Recreando FLVEH_F001...');
    try {
      await connection.execute('DROP TABLE IF EXISTS FLVEHI.FLVEH_F001');
      
      await connection.execute(`
        CREATE TABLE FLVEHI.FLVEH_F001 (
          id_foto INT AUTO_INCREMENT PRIMARY KEY,
          id_hoja INT NOT NULL,
          id_empresa INT NOT NULL DEFAULT 1,
          tipo_hoja CHAR(1) NOT NULL DEFAULT 'S',
          foto LONGBLOB NOT NULL,
          id_usuario VARCHAR(50) NOT NULL,
          fe_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          fe_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          estado VARCHAR(10) NOT NULL DEFAULT 'ING',
          tipo_foto ENUM('lateral_derecha', 'lateral_izquierda', 'frontal', 'trasero', 'odometro') NOT NULL,
          nombre_archivo VARCHAR(255),
          tamano_archivo INT,
          tipo_mime VARCHAR(50),
          INDEX idx_id_hoja (id_hoja),
          INDEX idx_estado (estado),
          INDEX idx_tipo_foto (tipo_foto),
          FOREIGN KEY (id_hoja) REFERENCES FLVEHI.FLVEH_T001(id_hoja) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ FLVEH_F001 recreada correctamente');
    } catch (error) {
      console.log('Error recreando FLVEH_F001:', error.message);
    }

    // Eliminar y recrear FLVEH_F002
    console.log('\n📋 Recreando FLVEH_F002...');
    try {
      await connection.execute('DROP TABLE IF EXISTS FLVEHI.FLVEH_F002');
      
      await connection.execute(`
        CREATE TABLE FLVEHI.FLVEH_F002 (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ FLVEH_F002 recreada correctamente');
    } catch (error) {
      console.log('Error recreando FLVEH_F002:', error.message);
    }

    // Verificar estructura final
    console.log('\n🔍 Verificando estructura final...');
    
    console.log('\n📋 FLVEH_F001 final:');
    const [f001Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F001');
    f001Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    console.log('\n📋 FLVEH_F002 final:');
    const [f002Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F002');
    f002Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    await connection.end();
    console.log('\n✅ Recreación de tablas completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

recreatePhotoTables();
