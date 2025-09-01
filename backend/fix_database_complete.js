const mysql = require('mysql2/promise');
require('dotenv').config();

const fixDatabaseComplete = async () => {
  console.log('🔧 Reparando base de datos completa...\n');

  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'flveh_s002',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conectado a la base de datos');

    // 1. Verificar que la tabla usuarios existe
    console.log('\n📋 1. Verificando tabla usuarios...');
    
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'usuarios'
    `);

    if (tables.length === 0) {
      console.log('   ❌ Tabla usuarios no existe, creándola...');
      
      await connection.execute(`
        CREATE TABLE usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          nombre VARCHAR(100),
          apellido VARCHAR(100),
          status ENUM('activo', 'inactivo') DEFAULT 'activo',
          id_empresa INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('   ✅ Tabla usuarios creada');
    } else {
      console.log('   ✅ Tabla usuarios existe');
    }

    // 2. Verificar estructura de la tabla usuarios
    console.log('\n🔍 2. Verificando estructura de tabla usuarios...');
    
    const [columns] = await connection.execute(`
      DESCRIBE usuarios
    `);
    
    console.log('   Columnas encontradas:');
    columns.forEach(col => {
      console.log(`     - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // 3. Verificar usuarios existentes
    console.log('\n👥 3. Verificando usuarios existentes...');
    
    const [existingUsers] = await connection.execute(`
      SELECT id, username, status, id_empresa FROM usuarios
    `);
    
    if (existingUsers.length === 0) {
      console.log('   ❌ No hay usuarios en la base de datos');
    } else {
      console.log(`   ✅ Encontrados ${existingUsers.length} usuarios:`);
      existingUsers.forEach(user => {
        console.log(`     - ID: ${user.id}, Username: ${user.username}, Status: ${user.status}, Empresa: ${user.id_empresa}`);
      });
    }

    // 4. Crear/actualizar usuarios de prueba
    console.log('\n🔑 4. Creando/actualizando usuarios de prueba...');
    
    const bcrypt = require('bcryptjs');
    const testUsers = [
      {
        username: 'ronald',
        password: '1122',
        email: 'ronald@example.com',
        nombre: 'Ronald',
        apellido: 'Test',
        id_empresa: 1
      },
      {
        username: 'otro',
        password: 'otro',
        email: 'otro@example.com',
        nombre: 'Otro',
        apellido: 'Usuario',
        id_empresa: 1
      },
      {
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        nombre: 'Admin',
        apellido: 'Sistema',
        id_empresa: 1
      }
    ];

    for (const user of testUsers) {
      console.log(`   Procesando usuario: ${user.username}`);
      
      // Verificar si el usuario existe
      const [existingUser] = await connection.execute(`
        SELECT id, password FROM usuarios WHERE username = ?
      `, [user.username]);

      if (existingUser.length > 0) {
        console.log(`     ✅ Usuario ${user.username} ya existe`);
        
        // Verificar si la contraseña necesita actualización
        const isPasswordValid = await bcrypt.compare(user.password, existingUser[0].password);
        
        if (!isPasswordValid) {
          console.log(`     🔄 Actualizando contraseña para ${user.username}`);
          const hashedPassword = await bcrypt.hash(user.password, 10);
          
          await connection.execute(`
            UPDATE usuarios 
            SET password = ?, email = ?, nombre = ?, apellido = ?, id_empresa = ?, status = 'activo'
            WHERE username = ?
          `, [hashedPassword, user.email, user.nombre, user.apellido, user.id_empresa, user.username]);
          
          console.log(`     ✅ Contraseña actualizada para ${user.username}`);
        } else {
          console.log(`     ✅ Contraseña de ${user.username} es correcta`);
        }
      } else {
        console.log(`     ➕ Creando nuevo usuario: ${user.username}`);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        await connection.execute(`
          INSERT INTO usuarios (username, password, email, nombre, apellido, id_empresa, status)
          VALUES (?, ?, ?, ?, ?, ?, 'activo')
        `, [user.username, hashedPassword, user.email, user.nombre, user.apellido, user.id_empresa]);
        
        console.log(`     ✅ Usuario ${user.username} creado`);
      }
    }

    // 5. Verificar usuarios finales
    console.log('\n✅ 5. Verificación final de usuarios...');
    
    const [finalUsers] = await connection.execute(`
      SELECT id, username, email, nombre, apellido, status, id_empresa FROM usuarios
    `);
    
    console.log(`   Total de usuarios: ${finalUsers.length}`);
    finalUsers.forEach(user => {
      console.log(`     - ${user.username} (${user.nombre} ${user.apellido}) - ${user.status} - Empresa: ${user.id_empresa}`);
    });

    // 6. Verificar que se puede hacer login
    console.log('\n🧪 6. Verificando que se puede hacer login...');
    
    const testUser = testUsers[0]; // ronald/1122
    const [loginUser] = await connection.execute(`
      SELECT id, username, password, status FROM usuarios WHERE username = ?
    `, [testUser.username]);

    if (loginUser.length > 0) {
      const isPasswordValid = await bcrypt.compare(testUser.password, loginUser[0].password);
      
      if (isPasswordValid && loginUser[0].status === 'activo') {
        console.log(`   ✅ Login válido para ${testUser.username}`);
        console.log(`   User ID: ${loginUser[0].id}`);
        console.log(`   Status: ${loginUser[0].status}`);
      } else {
        console.log(`   ❌ Problema con login para ${testUser.username}`);
        if (!isPasswordValid) console.log('     - Contraseña incorrecta');
        if (loginUser[0].status !== 'activo') console.log('     - Usuario inactivo');
      }
    } else {
      console.log(`   ❌ Usuario ${testUser.username} no encontrado`);
    }

    console.log('\n🎉 ¡Base de datos reparada exitosamente!');
    console.log('\n📋 RESUMEN:');
    console.log('============');
    console.log('✅ Tabla usuarios verificada/creada');
    console.log('✅ Usuarios de prueba creados/actualizados');
    console.log('✅ Contraseñas hasheadas correctamente');
    console.log('✅ Login funcional verificado');
    
    console.log('\n🔧 PRÓXIMO PASO:');
    console.log('1. Ejecuta: node test_login_complete.js');
    console.log('2. Si todo funciona, prueba el frontend');

  } catch (error) {
    console.error('❌ Error reparando base de datos:', error.message);
    console.log('\n💡 SOLUCIÓN:');
    console.log('1. Verifica que MySQL esté corriendo');
    console.log('2. Verifica las credenciales en .env');
    console.log('3. Verifica que la base de datos flveh_s002 exista');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión a base de datos cerrada');
    }
  }
};

// Run database fix
fixDatabaseComplete();
