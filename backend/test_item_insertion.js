const mysql = require('mysql2/promise');
require('dotenv').config();

async function testItemInsertion() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧪 Probando inserción directa en FLVEH_T002...');
    
    const id_hoja = 72;
    const id_check = 10;
    const anotacion = 'Prueba directa';
    const id_usuario = 1;
    
    try {
      await connection.execute(
        `INSERT INTO FLVEHI.FLVEH_T002 (
          id_hoja, id_empresa, id_check, anotacion, id_usuario, 
          tiempo_inicio, tiempo_final, fe_registro, fe_modificacion, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
        [
          id_hoja, 1, id_check, anotacion, id_usuario,
          '', '', 'ING'
        ]
      );
      
      console.log('✅ Inserción directa exitosa');
      
      // Verificar que se insertó
      const [items] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
      console.log(`Items encontrados para hoja ${id_hoja}: ${items.length}`);
      items.forEach(item => {
        console.log(`  - Item ${item.id_check}: ${item.anotacion}`);
      });
      
    } catch (error) {
      console.log('❌ Error en inserción directa:', error.message);
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testItemInsertion();
