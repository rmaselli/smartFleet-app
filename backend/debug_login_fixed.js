const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const debugLoginFixed = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🔍 Debugging login process - FIXED VERSION...');
  console.log(`📊 Database: ${dbConfig.host}:3306/${dbConfig.database}`);
  console.log(`👤 User: ${dbConfig.user}`);

  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Test credentials - try multiple users
    const testCredentials = [
      { username: 'ronald', password: '1122' },
      { username: 'otro', password: 'otro' },
      { username: 'admin', password: 'admin123' }
    ];

    for (const cred of testCredentials) {
      console.log(`\n🧪 Testing login with credentials: ${cred.username} / ${cred.password}`);
      
      try {
        // Step 1: Check if table exists
        console.log('1️⃣ Checking if flveh_s002 table exists...');
        const [tables] = await connection.execute(
          'SHOW TABLES LIKE "flveh_s002"'
        );
        
        if (tables.length === 0) {
          console.log('❌ Table flveh_s002 not found!');
          console.log('💡 This is why login is failing');
          continue;
        }
        console.log('✅ Table flveh_s002 exists');

        // Step 2: Check table structure
        console.log('2️⃣ Checking table structure...');
        const [columns] = await connection.execute('DESCRIBE flveh_s002');
        console.log('Table columns:');
        columns.forEach(col => {
          console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
        });

        // Step 3: Check if user exists
        console.log('3️⃣ Checking if user exists...');
        const [users] = await connection.execute(
          'SELECT * FROM flveh_s002 WHERE (usuario = ? OR email = ?) AND estatus = "ACT"',
          [cred.username, cred.username]
        );

        if (users.length === 0) {
          console.log('❌ No users found with these credentials');
          console.log('💡 This is why login is failing - no matching user');
          
          // Show all users for debugging
          const [allUsers] = await connection.execute('SELECT usuario, email, estatus FROM flveh_s002');
          if (allUsers.length > 0) {
            console.log('📋 Available users:');
            allUsers.forEach(user => {
              console.log(`   - Usuario: ${user.usuario}, Email: ${user.email}, Status: ${user.estatus}`);
            });
          } else {
            console.log('⚠️  No users found in table at all');
          }
          continue;
        }

        console.log('✅ User found:', users[0].usuario);
        console.log('User data:', {
          id_empresa: users[0].id_empresa,
          usuario: users[0].usuario,
          email: users[0].email,
          estatus: users[0].estatus,
          hasPassword: !!users[0].pass,
          passwordLength: users[0].pass ? users[0].pass.length : 0
        });

        // Step 4: Check password
        console.log('4️⃣ Checking password...');
        const user = users[0];
        
        if (!user.pass) {
          console.log('❌ User has no password field!');
          console.log('💡 This is why login is failing - missing password');
          continue;
        }
        
        const isValidPassword = await bcrypt.compare(cred.password, user.pass);
        
        if (!isValidPassword) {
          console.log('❌ Password is invalid');
          console.log('💡 This is why login is failing - wrong password');
          
          // Show password hash for debugging
          console.log('Password hash in DB:', user.pass);
          console.log('Testing hash of input password...');
          const testHash = await bcrypt.hash(cred.password, 12);
          console.log('Hash of input password:', testHash);
          continue;
        }

        console.log('✅ Password is valid');

        // Step 5: Generate token (simulate backend)
        console.log('5️⃣ Generating JWT token...');
        const token = jwt.sign(
          { 
            userId: user.id_empresa,
            username: user.usuario,
            role: 'user'
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { 
            expiresIn: '24h',
            algorithm: 'HS256'
          }
        );

        console.log('✅ Token generated successfully');
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 50) + '...');

        // Step 6: Simulate response
        console.log('6️⃣ Simulating backend response...');
        const response = {
          message: 'Login successful',
          token: token,
          user: {
            id: user.id_empresa,
            username: user.usuario,
            email: user.email,
            full_name: user.nombre || user.usuario,
            phone: null,
            department: null,
            company_id: user.id_empresa,
            status: user.estatus
          }
        };

        console.log('✅ Response structure:');
        console.log('   - hasToken:', !!response.token);
        console.log('   - hasUser:', !!response.user);
        console.log('   - tokenType:', typeof response.token);
        console.log('   - userType:', typeof response.user);
        console.log('   - message:', response.message);

        // Step 7: Test JSON serialization
        console.log('7️⃣ Testing JSON serialization...');
        try {
          const jsonResponse = JSON.stringify(response);
          console.log('✅ JSON serialization successful');
          console.log('JSON length:', jsonResponse.length);
          console.log('JSON preview:', jsonResponse.substring(0, 100) + '...');
        } catch (error) {
          console.log('❌ JSON serialization failed:', error.message);
        }

        // Step 8: Test database update
        console.log('8️⃣ Testing database update...');
        try {
          await connection.execute(
            'UPDATE flveh_s002 SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_empresa = ?',
            [user.id_empresa]
          );
          console.log('✅ Last login time updated successfully');
        } catch (error) {
          console.log('❌ Failed to update last login time:', error.message);
        }

        console.log('\n🎉 SUCCESS! Login should work with these credentials:');
        console.log('   Username:', cred.username);
        console.log('   Password:', cred.password);
        
        // Break out of the loop since we found working credentials
        break;
        
      } catch (error) {
        console.log(`❌ Error testing credentials ${cred.username}:`, error.message);
        continue;
      }
    }

    await connection.end();
    console.log('\n✅ Login debug completed');
    
  } catch (error) {
    console.error('❌ Login debug failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Database credentials are correct');
    console.error('   3. Database FLVEHI exists');
    console.error('   4. User has proper permissions');
  }
};

// Run the debug
debugLoginFixed();
