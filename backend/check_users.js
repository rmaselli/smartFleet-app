const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando usuarios en FLVEH_S002...');
    
    const [users] = await connection.execute('SELECT id_empresa, id_usuario, nombre, usuario, email, estatus FROM FLVEHI.FLVEH_S002');
    
    console.log('\nUsuarios encontrados:');
    users.forEach(user => {
      console.log(`  ID: ${user.id_usuario}, Usuario: ${user.usuario}, Nombre: ${user.nombre}, Estado: ${user.estatus}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUsers();
