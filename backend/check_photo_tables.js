const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando existencia de tablas de fotos...');
    
    // Verificar FLVEH_F001
    try {
      const [f001] = await connection.execute('SHOW TABLES LIKE "FLVEH_F001"');
      console.log('FLVEH_F001:', f001.length > 0 ? '✅ Existe' : '❌ No existe');
      
      if (f001.length > 0) {
        const [structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F001');
        console.log('Estructura FLVEH_F001:', structure.map(col => col.Field).join(', '));
      }
    } catch (error) {
      console.log('Error verificando FLVEH_F001:', error.message);
    }

    // Verificar FLVEH_F002
    try {
      const [f002] = await connection.execute('SHOW TABLES LIKE "FLVEH_F002"');
      console.log('FLVEH_F002:', f002.length > 0 ? '✅ Existe' : '❌ No existe');
      
      if (f002.length > 0) {
        const [structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F002');
        console.log('Estructura FLVEH_F002:', structure.map(col => col.Field).join(', '));
      }
    } catch (error) {
      console.log('Error verificando FLVEH_F002:', error.message);
    }

    // Verificar FLVEH_T001
    try {
      const [t001] = await connection.execute('SHOW TABLES LIKE "FLVEH_T001"');
      console.log('FLVEH_T001:', t001.length > 0 ? '✅ Existe' : '❌ No existe');
    } catch (error) {
      console.log('Error verificando FLVEH_T001:', error.message);
    }

    // Verificar FLVEH_M007
    try {
      const [m007] = await connection.execute('SHOW TABLES LIKE "FLVEH_M007"');
      console.log('FLVEH_M007:', m007.length > 0 ? '✅ Existe' : '❌ No existe');
    } catch (error) {
      console.log('Error verificando FLVEH_M007:', error.message);
    }

    await connection.end();
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
}

checkTables();
