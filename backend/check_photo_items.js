const mysql = require('mysql2/promise');

async function checkPhotoItems() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'FLVEHI'
  });
  
  try {
    const [rows] = await connection.execute('SELECT id_foto_item, id_hoja, id_check FROM FLVEH_F002 WHERE estado = "ING" LIMIT 5');
    console.log('Fotos de items disponibles:');
    console.table(rows);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkPhotoItems();
