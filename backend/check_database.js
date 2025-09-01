const mysql = require('mysql2/promise');
require('dotenv').config();

const checkDatabase = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🔍 Checking database and table structure...');
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
    
    if (tables.length > 0) {
      console.log('✅ Table flveh_s002 exists');
      
      // Show table structure
      console.log('\n2️⃣ Table structure:');
      const [columns] = await connection.execute('DESCRIBE flveh_s002');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });

      // Count users
      console.log('\n3️⃣ User count:');
      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM flveh_s002');
      console.log(`   Total users: ${userCount[0].count}`);

      // Show sample users (without passwords)
      if (userCount[0].count > 0) {
        console.log('\n4️⃣ Sample users:');
        const [users] = await connection.execute(
          'SELECT id_empresa, usuario, email, estatus, ultimo_acceso, fe_registro FROM flveh_s002 LIMIT 5'
        );
        
        users.forEach((user, index) => {
          console.log(`   User ${index + 1}:`);
          console.log(`     ID Empresa: ${user.id_empresa}`);
          console.log(`     Usuario: ${user.usuario}`);
          console.log(`     Email: ${user.email}`);
          console.log(`     Estatus: ${user.estatus}`);
          console.log(`     Último Acceso: ${user.ultimo_acceso}`);
          console.log(`     Fecha Registro: ${user.fe_registro}`);
          console.log('');
        });
      } else {
        console.log('⚠️  No users found in table');
      }

      // Check for admin user
      console.log('\n5️⃣ Checking for admin user...');
      const [adminUsers] = await connection.execute(
        'SELECT usuario, email, estatus FROM flvehi.flveh_s002 WHERE usuario = "admin"'
      );
      
      if (adminUsers.length > 0) {
        console.log('✅ Admin users found:');
        adminUsers.forEach(admin => {
          console.log(`   - ${admin.usuario} (${admin.email}) - Status: ${admin.estatus}`);
        });
      } else {
        console.log('⚠️  No admin users found');
      }

    } else {
      console.log('❌ Table flveh_s002 not found!');
      console.log('💡 This is why login is failing - the users table does not exist');
      
      // Check what tables exist
      console.log('\n📋 Available tables:');
      const [allTables] = await connection.execute('SHOW TABLES');
      allTables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }

    await connection.end();
    console.log('\n✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Database credentials are correct');
    console.error('   3. Database FLVEHI exists');
    console.error('   4. User has proper permissions');
  }
};

// Run the check
checkDatabase();
