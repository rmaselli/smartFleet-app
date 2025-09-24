const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkT002Data() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando datos en FLVEH_T002...');
    
    // Verificar estructura de la tabla
    console.log('\n📋 Estructura de FLVEH_T002:');
    const [structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Verificar registros existentes
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T002');
    console.log(`\nRegistros en FLVEH_T002: ${count[0].count}`);
    
    if (count[0].count > 0) {
      const [records] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 ORDER BY id_item_revisado DESC LIMIT 10');
      console.log('\nÚltimos 10 registros:');
      records.forEach(record => {
        console.log(`  ID: ${record.id_item_revisado}, Hoja: ${record.id_hoja}, Check: ${record.id_check}, Anotación: ${record.anotacion}`);
      });
    }
    
    // Verificar hojas recientes en T001
    console.log('\n📋 Últimas hojas en FLVEH_T001:');
    const [hojas] = await connection.execute('SELECT id_hoja, estado, fe_registro FROM FLVEHI.FLVEH_T001 ORDER BY id_hoja DESC LIMIT 5');
    hojas.forEach(hoja => {
      console.log(`  Hoja: ${hoja.id_hoja}, Estado: ${hoja.estado}, Fecha: ${hoja.fe_registro}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkT002Data();
