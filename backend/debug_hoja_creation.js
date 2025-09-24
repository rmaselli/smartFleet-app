const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugHojaCreation() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando hojas creadas...');
    
    const [hojas] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T001 ORDER BY id_hoja DESC LIMIT 5');
    
    console.log('\nÚltimas 5 hojas:');
    hojas.forEach(hoja => {
      console.log(`  ID: ${hoja.id_hoja}, Estado: ${hoja.estado}, Plataforma: ${hoja.id_plataforma}, Piloto: ${hoja.id_piloto}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugHojaCreation();
