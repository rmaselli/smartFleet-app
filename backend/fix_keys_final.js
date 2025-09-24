const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixKeysFinal() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Arreglando claves primarias final...');
    
    // Arreglar FLVEH_F001
    console.log('\n📋 Arreglando FLVEH_F001...');
    try {
      // Verificar si hay datos en la tabla
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F001');
      console.log(`  Registros en FLVEH_F001: ${count[0].count}`);
      
      if (count[0].count > 0) {
        console.log('  ⚠️  La tabla tiene datos, se recomienda hacer backup');
      }
      
      // Eliminar todas las claves primarias
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 DROP PRIMARY KEY');
      
      // Agregar clave primaria única en id_foto
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 ADD PRIMARY KEY (id_foto)');
      
      // Hacer foto NOT NULL
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 MODIFY foto LONGBLOB NOT NULL');
      
      console.log('✅ FLVEH_F001 arreglada correctamente');
    } catch (error) {
      console.log('Error arreglando FLVEH_F001:', error.message);
    }

    // Arreglar FLVEH_F002
    console.log('\n📋 Arreglando FLVEH_F002...');
    try {
      // Verificar si hay datos en la tabla
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F002');
      console.log(`  Registros en FLVEH_F002: ${count[0].count}`);
      
      if (count[0].count > 0) {
        console.log('  ⚠️  La tabla tiene datos, se recomienda hacer backup');
      }
      
      // Eliminar todas las claves primarias
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 DROP PRIMARY KEY');
      
      // Agregar clave primaria única en id_foto
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 ADD PRIMARY KEY (id_foto)');
      
      // Hacer foto NOT NULL
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 MODIFY foto LONGBLOB NOT NULL');
      
      console.log('✅ FLVEH_F002 arreglada correctamente');
    } catch (error) {
      console.log('Error arreglando FLVEH_F002:', error.message);
    }

    // Verificar estructura final
    console.log('\n🔍 Verificando estructura final...');
    
    console.log('\n📋 FLVEH_F001 final:');
    const [f001Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F001');
    f001Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    console.log('\n📋 FLVEH_F002 final:');
    const [f002Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F002');
    f002Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    await connection.end();
    console.log('\n✅ Arreglo de claves primarias completado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixKeysFinal();
