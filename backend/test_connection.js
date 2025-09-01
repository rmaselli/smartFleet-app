const mysql = require('mysql2/promise');
require('dotenv').config();

const testConnection = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'p3rson4l',
    database: process.env.DB_NAME || 'FLVEHI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('🔍 Testing database connection...');
  console.log(`📊 Config: ${dbConfig.host}:3306/${dbConfig.database}`);
  console.log(`👤 User: ${dbConfig.user}`);

  try {
    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Test query to verify table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "flveh_s002"');
    
    if (tables.length > 0) {
      console.log('✅ Table flveh_s002 exists');
      
      // Show table structure
      const [columns] = await connection.execute('DESCRIBE flveh_s002');
      console.log('📋 Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });

      // Count users
      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM flveh_s002');
      console.log(`👥 Total users in table: ${userCount[0].count}`);

    } else {
      console.log('⚠️  Table flveh_s002 not found');
    }

    await connection.end();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MySQL service is running');
    console.error('   2. Credentials are correct');
    console.error('   3. Database FLVEHI exists');
    console.error('   4. Table flveh_s002 exists');
  }
};

// Run the test
testConnection(); 