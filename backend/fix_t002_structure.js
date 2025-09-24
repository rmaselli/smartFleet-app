const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixT002Structure() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Corrigiendo estructura de FLVEH_T002...');
    
    // Verificar estructura actual
    console.log('\n📋 Estructura actual de FLVEH_T002:');
    const [currentStructure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    currentStructure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Verificar si hay datos
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T002');
    console.log(`\nRegistros existentes: ${count[0].count}`);
    
    if (count[0].count > 0) {
      console.log('⚠️  La tabla tiene datos, se recomienda hacer backup');
    }
    
    // Eliminar la tabla y recrearla con la estructura correcta
    console.log('\n📋 Recreando FLVEH_T002 con estructura correcta...');
    await connection.execute('DROP TABLE IF EXISTS FLVEHI.FLVEH_T002');
    
    await connection.execute(`
      CREATE TABLE FLVEHI.FLVEH_T002 (
        id_item_revisado INT AUTO_INCREMENT PRIMARY KEY,
        id_hoja INT NOT NULL,
        id_empresa INT NOT NULL DEFAULT 1,
        id_check INT NOT NULL,
        anotacion VARCHAR(255),
        id_usuario INT NOT NULL,
        tiempo_inicio VARCHAR(10),
        tiempo_final VARCHAR(10),
        fe_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fe_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        estado VARCHAR(10) NOT NULL DEFAULT 'ING',
        INDEX idx_id_hoja (id_hoja),
        INDEX idx_id_check (id_check),
        INDEX idx_estado (estado),
        FOREIGN KEY (id_hoja) REFERENCES FLVEHI.FLVEH_T001(id_hoja) ON DELETE CASCADE,
        FOREIGN KEY (id_check) REFERENCES FLVEHI.FLVEH_M007(id_check) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ FLVEH_T002 recreada con estructura correcta');
    
    // Verificar estructura final
    console.log('\n📋 Estructura final de FLVEH_T002:');
    const [finalStructure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    finalStructure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    await connection.end();
    console.log('\n✅ Corrección de estructura completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixT002Structure();
