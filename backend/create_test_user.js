const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createTestUser = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🔧 Creating test user for authentication...');
  console.log(`📊 Database: ${dbConfig.host}:3306/${dbConfig.database}`);
  console.log(`👤 User: ${dbConfig.user}`);

  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Check if flveh_s002 table exists
    console.log('\n1️⃣ Checking if flveh_s002 table exists...');
    const [tables] = await connection.execute(
      'SHOW TABLES LIKE "flveh_s002"'
    );
    
    if (tables.length === 0) {
      console.log('❌ Table flveh_s002 not found!');
      console.log('💡 Creating table...');
      
      // Create the table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS flveh_s002 (
          id_empresa INT AUTO_INCREMENT PRIMARY KEY,
          id_usuario INT,
          nombre VARCHAR(255) NOT NULL,
          usuario VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          pass VARCHAR(255) NOT NULL,
          token VARCHAR(500),
          ultimo_acceso TIMESTAMP NULL,
          fe_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          estatus ENUM('ACT', 'INA') DEFAULT 'ACT'
        )
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ Table flveh_s002 created successfully!');
    } else {
      console.log('✅ Table flveh_s002 already exists');
    }

    // Check if admin user already exists
    console.log('\n2️⃣ Checking if admin user exists...');
    const [existingUsers] = await connection.execute(
      'SELECT id_empresa, usuario, email, estatus FROM flveh_s002 WHERE usuario = ?',
      ['admin']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists:');
      existingUsers.forEach(user => {
        console.log(`   - ID: ${user.id_empresa}, Usuario: ${user.usuario}, Email: ${user.email}, Status: ${user.estatus}`);
      });
      
      // Ask if user wants to update password
      console.log('\n💡 Admin user exists. You can use these credentials:');
      console.log('   Username: otro');
      console.log('   Password: otro');
      
    } else {
      console.log('📝 Admin user not found, creating...');
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('otro', saltRounds);
      
      // Insert admin user
      const insertSQL = `
        INSERT INTO flveh_s002 (
          id_empresa,
          id_usuario,
          nombre,
          usuario,
          email,
          pass,
          token,
          estatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await connection.execute(insertSQL, [
        3,                    // id_empresa
        3,                    // id_usuario
        'otro',      // nombre
        'otro',              // usuario
        'otro@fleetsmart.com', // email
        hashedPassword,       // pass (hasheado)
        'temp_token',         // token
        'ACT'                 // estatus
      ]);
      
      console.log('✅ Admin user created successfully!');
      console.log('   ID: ' + result.insertId);
      console.log('   Username: otro');
      console.log('   Password: otro');
      console.log('   Email: otro@fleetsmart.com');
    }

    // Show current users
    console.log('\n3️⃣ Current users in database:');
    const [allUsers] = await connection.execute(
      'SELECT id_empresa, usuario, email, estatus, fe_registro FROM flveh_s002 ORDER BY id_empresa'
    );
    
    if (allUsers.length > 0) {
      allUsers.forEach((user, index) => {
        console.log(`   User ${index + 1}:`);
        console.log(`     ID: ${user.id_empresa}`);
        console.log(`     Usuario: ${user.usuario}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Status: ${user.estatus}`);
        console.log(`     Created: ${user.fe_registro}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No users found in table');
    }

    await connection.end();
    console.log('\n✅ Test user creation completed');
    console.log('\n🚀 You can now test login with:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Test user creation failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Database credentials are correct');
    console.error('   3. Database FLVEHI exists');
    console.error('   4. You have CREATE and INSERT permissions');
    console.error('\n🔧 To fix this:');
    console.error('   1. Start MySQL service');
    console.error('   2. Create database: CREATE DATABASE FLVEHI;');
    console.error('   3. Grant permissions to your user');
    console.error('   4. Run this script again');
  }
};

// Run the script
createTestUser();
