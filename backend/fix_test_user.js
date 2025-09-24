const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixTestUser() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Arreglando usuario de prueba...');
    
    // Eliminar usuarios duplicados
    await connection.execute('DELETE FROM FLVEHI.FLVEH_S002 WHERE id_usuario = 999');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_S002 WHERE usuario = "testuser" AND id_usuario != 4');
    
    // Crear usuario correcto
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await connection.execute(`
      INSERT INTO FLVEHI.FLVEH_S002 (id_empresa, id_usuario, nombre, usuario, email, pass, estatus, fe_registro)
      VALUES (1, 5, 'Test User', 'testuser', 'test@test.com', ?, 'ACT', CURRENT_TIMESTAMP)
    `, [hashedPassword]);
    
    console.log('✅ Usuario de prueba arreglado: testuser / 123456 (ID: 5)');

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixTestUser();
