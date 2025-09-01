const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'p3rson4l',
  database: process.env.DB_NAME || 'FLVEHI',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and tables
const initDatabase = async () => {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully to FLVEHI');
    console.log(`📊 Connected to: ${dbConfig.host}:3306/${dbConfig.database}`);
    connection.release();

    // Verify that flveh_s002 table exists
    await verifyTables();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const verifyTables = async () => {
  try {
    // Check if flveh_s002 table exists
    const [tables] = await pool.execute(
      'SHOW TABLES LIKE "flveh_s002"'
    );
    
    if (tables.length > 0) {
      console.log('✅ Table flveh_s002 exists');
      
      // Show table structure
      const [columns] = await pool.execute('DESCRIBE flveh_s002');
      console.log('📋 Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });
    } else {
      console.log('⚠️  Table flveh_s002 not found, creating it...');
      await createTables();
    }
    
  } catch (error) {
    console.error('❌ Error verifying tables:', error.message);
  }
};

const createTables = async () => {
  try {
    // Users table - flveh_s002 (main users table for FLVEHI system)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS flveh_s002 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user', 'manager') DEFAULT 'user',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        company_id INT,
        department VARCHAR(100),
        phone VARCHAR(20),
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        updated_by INT,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_role (role),
        INDEX idx_company (company_id)
      )
    `);

    // Legacy users table (for backward compatibility)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tasks table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        due_date DATE,
        assigned_to INT,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES flveh_s002(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES flveh_s002(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables created successfully in FLVEHI');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

module.exports = {
  pool,
  initDatabase
}; 