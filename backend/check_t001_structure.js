const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkT001Structure() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando estructura de FLVEH_T001...');
    
    const [structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T001');
    console.log('\nEstructura FLVEH_T001:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkT001Structure();
