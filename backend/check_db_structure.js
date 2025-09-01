const { pool } = require('./config/database');

const checkDbStructure = async () => {
  console.log('🔍 Checking Database Structure...');
  
  try {
    // Test 1: Check if table exists
    console.log('\n1️⃣ Checking if flveh_s002 table exists...');
    const [tables] = await pool.execute(
      'SHOW TABLES FROM FLVEHI LIKE "flveh_s002"'
    );
    
    if (tables.length === 0) {
      console.log('❌ Table flveh_s002 does not exist in FLVEHI database');
      return;
    }
    
    console.log('✅ Table flveh_s002 exists');
    
    // Test 2: Check table structure
    console.log('\n2️⃣ Checking table structure...');
    const [columns] = await pool.execute(
      'DESCRIBE FLVEHI.flveh_s002'
    );
    
    console.log('📋 Table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    // Test 3: Check if user exists
    console.log('\n3️⃣ Checking if user "ronald" exists...');
    const [users] = await pool.execute(
      'SELECT id_empresa, usuario, email, nombre, estatus FROM FLVEHI.flveh_s002 WHERE usuario = ?',
      ['ronald']
    );
    
    if (users.length === 0) {
      console.log('❌ User "ronald" not found');
      return;
    }
    
    console.log('✅ User found:', users[0]);
    
    // Test 4: Test the exact query used in profile endpoint
    console.log('\n4️⃣ Testing profile query...');
    const [profileUsers] = await pool.execute(
      'SELECT id_empresa, usuario, email, nombre, estatus, ultimo_acceso, fe_registro FROM FLVEHI.flveh_s002 WHERE id_empresa = ?',
      [users[0].id_empresa]
    );
    
    if (profileUsers.length === 0) {
      console.log('❌ Profile query returned no results');
      return;
    }
    
    console.log('✅ Profile query successful:', profileUsers[0]);
    
    // Test 5: Check if all required columns exist
    console.log('\n5️⃣ Checking required columns...');
    const requiredColumns = ['id_empresa', 'usuario', 'email', 'nombre', 'estatus', 'ultimo_acceso', 'fe_registro'];
    const existingColumns = columns.map(col => col.Field);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns);
    } else {
      console.log('✅ All required columns exist');
    }
    
    console.log('\n🎉 Database structure check completed!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.error('💥 Full error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the check
checkDbStructure();
