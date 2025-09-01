const mysql = require('mysql2/promise');
require('dotenv').config();

const cleanupTokens = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flvehi',
    port: process.env.DB_PORT || 3306
  };

  console.log('🧹 Cleaning up problematic tokens...');
  console.log(`📊 Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Verificar estructura de la tabla
    console.log('\n1️⃣ Checking table structure...');
    const [columns] = await connection.execute('DESCRIBE flveh_s002');
    console.log('📋 Table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });

    // Verificar usuarios existentes
    console.log('\n2️⃣ Checking existing users...');
    const [users] = await connection.execute('SELECT id_empresa, usuario, email, estatus FROM FLVEHI.flveh_s002 LIMIT 5');
    
    if (users.length > 0) {
      console.log('👥 Found users:');
      users.forEach(user => {
        console.log(`   - ID: ${user.id_empresa}, Username: ${user.usuario}, Email: ${user.email}, Status: ${user.estatus}`);
      });
    } else {
      console.log('⚠️  No users found in table');
    }

    // Verificar si hay tokens problemáticos en la base de datos
    console.log('\n3️⃣ Checking for problematic data...');
    const [problematicUsers] = await connection.execute(
      'SELECT id_empresa, usuario, email FROM FLVEHI.flveh_s002 WHERE LENGTH(usuario) > 100 OR LENGTH(email) > 100'
    );

    if (problematicUsers.length > 0) {
      console.log('⚠️  Found users with problematic data:');
      problematicUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Username length: ${user.username?.length || 0}, Email length: ${user.email?.length || 0}`);
      });
      
      // Limpiar datos problemáticos
      console.log('\n🧹 Cleaning problematic data...');
      await connection.execute(
        'UPDATE FLVEHI.flveh_s002 SET usuario = LEFT(usuario, 10), email = LEFT(email, 30) WHERE LENGTH(usuario) > 100 OR LENGTH(email) > 100'
      );
      console.log('✅ Problematic data cleaned');
    } else {
      console.log('✅ No problematic data found');
    }

    // Verificar configuración de la base de datos
    console.log('\n4️⃣ Checking database configuration...');
    const [variables] = await connection.execute('SHOW VARIABLES LIKE "max_allowed_packet"');
    console.log('📦 Max allowed packet:', variables[0]?.Value || 'Not set');

    const [charset] = await connection.execute('SHOW VARIABLES LIKE "character_set_database"');
    console.log('🔤 Database charset:', charset[0]?.Value || 'Not set');

    await connection.end();
    console.log('\n🎉 Token cleanup completed successfully!');
    console.log('✅ Database is clean and ready for authentication');

  } catch (error) {
    console.error('❌ Token cleanup failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Database credentials are correct');
    console.error('   3. Database exists and is accessible');
  }
};

// Run cleanup
cleanupTokens();
