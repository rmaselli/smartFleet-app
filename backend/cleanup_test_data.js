const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupTestData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧹 Limpiando datos de prueba...');
    
    // Limpiar datos de prueba
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F002 WHERE id_hoja >= 60');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F001 WHERE id_hoja >= 60');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T002 WHERE id_hoja >= 60');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T001 WHERE id_hoja >= 60');
    
    console.log('✅ Datos de prueba eliminados');

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

cleanupTestData();
