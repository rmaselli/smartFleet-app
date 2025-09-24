const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLoginDirect() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Probando login directo...');
    
    const [users] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_S002 WHERE usuario = "testuser"');
    
    if (users.length > 0) {
      const user = users[0];
      console.log('Usuario encontrado:', user.usuario);
      console.log('Password hash:', user.pass);
      
      const isValidPassword = await bcrypt.compare('123456', user.pass);
      console.log('Password válida:', isValidPassword);
      
      if (!isValidPassword) {
        // Actualizar password
        const hashedPassword = await bcrypt.hash('123456', 10);
        await connection.execute('UPDATE FLVEHI.FLVEH_S002 SET pass = ? WHERE id_usuario = ?', [hashedPassword, user.id_usuario]);
        console.log('✅ Password actualizada');
      }
    } else {
      console.log('❌ Usuario no encontrado');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLoginDirect();
