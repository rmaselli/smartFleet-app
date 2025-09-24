const mysql = require('mysql2/promise');
require('dotenv').config();

async function recreateT002Completely() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Recreando FLVEH_T002 completamente...');
    
    // Eliminar la tabla existente
    console.log('\n📋 Eliminando tabla existente...');
    await connection.execute('DROP TABLE IF EXISTS FLVEHI.FLVEH_T002');
    console.log('✅ Tabla eliminada');
    
    // Crear la tabla con la estructura correcta
    console.log('\n📋 Creando tabla con estructura correcta...');
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
    console.log('✅ Tabla creada correctamente');
    
    // Verificar estructura final
    console.log('\n📋 Estructura final:');
    const [finalStructure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    finalStructure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });
    
    // Probar inserción
    console.log('\n🧪 Probando inserción...');
    try {
      await connection.execute(
        `INSERT INTO FLVEHI.FLVEH_T002 (
          id_hoja, id_empresa, id_check, anotacion, id_usuario, 
          tiempo_inicio, tiempo_final, fe_registro, fe_modificacion, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
        [999, 1, 10, 'Prueba de inserción', 1, '', '', 'ING']
      );
      console.log('✅ Inserción de prueba exitosa');
      
      // Verificar que se insertó
      const [testRecords] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 WHERE id_hoja = 999');
      console.log(`Registros de prueba: ${testRecords.length}`);
      
      // Limpiar datos de prueba
      await connection.execute('DELETE FROM FLVEHI.FLVEH_T002 WHERE id_hoja = 999');
      console.log('✅ Datos de prueba eliminados');
      
    } catch (error) {
      console.log('❌ Error en inserción de prueba:', error.message);
    }

    await connection.end();
    console.log('\n✅ Recreación de FLVEH_T002 completada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

recreateT002Completely();
