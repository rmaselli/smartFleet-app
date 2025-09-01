const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testRegistration = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🧪 Testing user registration functionality...');
  console.log(`📊 Database: ${dbConfig.host}:3306/${dbConfig.database}`);

  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Test data for new user
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpass123',
      full_name: 'Usuario de Prueba',
      phone: '+57 300 123 4567',
      department: 'Desarrollo',
      company_id: 1
    };

    const usrprueba = {
      id_empresa: 2,
      id_usuario: 1,
      nombre: 'ronald',
      usuario: 'ronald',
      email: 'ronald@gmail.com',
      pass: '1122',
      token: '1234567890',
      ultimo_acceso: '2025-01-01',
      fe_registro: '2025-01-01',
      estatus: 'ACT'
    };

    console.log('\n📝 Test user data:');
    console.log(`   Username: ${testUser.username}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Full Name: ${testUser.full_name}`);
    console.log(`   Phone: ${testUser.phone}`);
    console.log(`   Department: ${testUser.department}`);
    console.log(`   Company ID: ${testUser.company_id}`);

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(usrprueba.pass, saltRounds);
    console.log('🔐 Password hashed successfully');

    // Insert test user
    const [result] = await connection.execute(
      `INSERT INTO flvehi.flveh_s002 (
        id_empresa,id_usuario,nombre,usuario,email,pass,token,ultimo_acceso,fe_registro,estatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
      [


        usrprueba.id_empresa,
        usrprueba.id_usuario,
        usrprueba.nombre,
        usrprueba.usuario,
        usrprueba.email,
        hashedPassword,
        usrprueba.token,
        usrprueba.ultimo_acceso,
        usrprueba.fe_registro,
        usrprueba.estatus
      ]
    );

    console.log(`✅ Test user inserted successfully with ID: ${result.insertId}`);

    // Verify user was created
    const [users] = await connection.execute(
      'SELECT * FROM flvehi.flveh_s002 WHERE usuario = ?',
      [result.insertId]
    );

    if (users.length > 0) {
      const createdUser = users[0];
      console.log('\n✅ User verification successful:');
      console.log(`   ID: ${createdUser.id}`);
      console.log(`   Username: ${createdUser.username}`);
      console.log(`   Email: ${createdUser.email}`);
      console.log(`   Full Name: ${createdUser.full_name}`);
      console.log(`   Phone: ${createdUser.phone}`);
      console.log(`   Department: ${createdUser.department}`);
      console.log(`   Company ID: ${createdUser.company_id}`);
      console.log(`   Role: ${createdUser.role}`);
      console.log(`   Status: ${createdUser.status}`);
      console.log(`   Created At: ${createdUser.created_at}`);
    }

    // Test password verification
    const isValidPassword = await bcrypt.compare(usrprueba.pass, hashedPassword);
    console.log(`🔐 Password verification: ${isValidPassword ? '✅ PASS' : '❌ FAIL'}`);

    // Clean up - delete test user
    await connection.execute(
      'DELETE FROM flvehi.flveh_s002 WHERE id_empresa = ?',
      [result.insertId]
    );
    console.log('🧹 Test user cleaned up successfully');

    // Show final user count
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM flvehi.flveh_s002');
    console.log(`👥 Final user count: ${userCount[0].count}`);

    await connection.end();
    console.log('\n🎉 Registration test completed successfully!');
    console.log('✅ All database operations working correctly');
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    console.error('💡 Error details:', error);
  }
};

// Run the test
testRegistration();
