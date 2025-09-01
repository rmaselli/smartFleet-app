const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixDatabase = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🔧 Fixing database structure and users...');
  console.log(`📊 Database: ${dbConfig.host}:3306/${dbConfig.database}`);
  console.log(`👤 User: ${dbConfig.user}`);

  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Step 1: Create table if it doesn't exist
    console.log('\n1️⃣ Creating/verifying flveh_s002 table...');
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
    console.log('✅ Table flveh_s002 created/verified successfully!');

    // Step 2: Check current users
    console.log('\n2️⃣ Checking current users...');
    const [currentUsers] = await connection.execute('SELECT usuario, email, estatus FROM flveh_s002');
    
    if (currentUsers.length > 0) {
      console.log('📋 Current users:');
      currentUsers.forEach(user => {
        console.log(`   - Usuario: ${user.usuario}, Email: ${user.email}, Status: ${user.estatus}`);
      });
    } else {
      console.log('⚠️  No users found in table');
    }

    // Step 3: Create/update test users
    console.log('\n3️⃣ Creating/updating test users...');
    
    const testUsers = [
      {
        id_empresa: 1,
        id_usuario: 1,
        nombre: 'Ronald',
        usuario: 'ronald',
        email: 'ronald@fleetsmart.com',
        password: '1122',
        estatus: 'ACT'
      },
      {
        id_empresa: 2,
        id_usuario: 2,
        nombre: 'Administrador',
        usuario: 'admin',
        email: 'admin@fleetsmart.com',
        password: 'admin123',
        estatus: 'ACT'
      },
      {
        id_empresa: 3,
        id_usuario: 3,
        nombre: 'Otro Usuario',
        usuario: 'otro',
        email: 'otro@fleetsmart.com',
        password: 'otro',
        estatus: 'ACT'
      }
    ];

    for (const testUser of testUsers) {
      console.log(`\n   Processing user: ${testUser.usuario}`);
      
      // Check if user exists
      const [existingUsers] = await connection.execute(
        'SELECT id_empresa, id_usuario, usuario, email, estatus FROM flveh_s002 WHERE usuario = ?',
        [testUser.usuario]
      );

      if (existingUsers.length > 0) {
        console.log(`     ✅ User ${testUser.usuario} already exists`);
        
        // Update password if needed
        const existingUser = existingUsers[0];
        if (existingUser.estatus !== 'ACT') {
          console.log(`     🔄 Updating status to ACT for user ${testUser.usuario}`);
          await connection.execute(
            'UPDATE flveh_s002 SET estatus = ? WHERE usuario = ?',
            ['ACT', testUser.usuario]
          );
        }
        
        // Update password to ensure it's correct
        console.log(`     🔄 Updating password for user ${testUser.usuario}`);
        const hashedPassword = await bcrypt.hash(testUser.password, 12);
        await connection.execute(
          'UPDATE flveh_s002 SET pass = ? WHERE usuario = ?',
          [hashedPassword, testUser.usuario]
        );
        
      } else {
        console.log(`     📝 Creating new user: ${testUser.usuario}`);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(testUser.password, 12);
        
        // Insert new user
        const insertSQL = `
          INSERT INTO flveh_s002 (
            id_empresa, id_usuario, nombre, usuario, email, pass, token, estatus
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.execute(insertSQL, [
          testUser.id_empresa,
          testUser.id_usuario,
          testUser.nombre,
          testUser.usuario,
          testUser.email,
          hashedPassword,
          'temp_token',
          testUser.estatus
        ]);
        
        console.log(`     ✅ User ${testUser.usuario} created successfully`);
      }
    }

    // Step 4: Verify final state
    console.log('\n4️⃣ Verifying final database state...');
    const [finalUsers] = await connection.execute(
      'SELECT id_empresa, id_usuario, nombre, usuario, email, estatus, fe_registro FROM flveh_s002 ORDER BY id_empresa'
    );
    
    if (finalUsers.length > 0) {
      console.log('📋 Final users in database:');
      finalUsers.forEach((user, index) => {
        console.log(`   User ${index + 1}:`);
        console.log(`     ID: ${user.id_empresa}`);
        console.log(`     Usuario: ${user.usuario}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Status: ${user.estatus}`);
        console.log(`     Created: ${user.fe_registro}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No users found in table after creation');
    }

    // Step 5: Test password verification
    console.log('\n5️⃣ Testing password verification...');
    for (const testUser of testUsers) {
      try {
        const [users] = await connection.execute(
          'SELECT pass FROM flveh_s002 WHERE usuario = ?',
          [testUser.usuario]
        );
        
        if (users.length > 0) {
          const isValidPassword = await bcrypt.compare(testUser.password, users[0].pass);
          console.log(`   ${testUser.usuario}: ${isValidPassword ? '✅' : '❌'} Password verification`);
        } else {
          console.log(`   ${testUser.usuario}: ❌ User not found`);
        }
      } catch (error) {
        console.log(`   ${testUser.usuario}: ❌ Error: ${error.message}`);
      }
    }

    await connection.end();
    console.log('\n✅ Database fix completed successfully');
    console.log('\n🚀 You can now test login with these credentials:');
    console.log('   1. Username: ronald, Password: 1122');
    console.log('   2. Username: admin, Password: admin123');
    console.log('   3. Username: otro, Password: otro');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Database credentials are correct');
    console.error('   3. Database FLVEHI exists');
    console.error('   4. User has proper permissions');
  }
};

// Run the fix
fixDatabase();


