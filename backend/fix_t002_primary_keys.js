const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixT002PrimaryKeys() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Corrigiendo claves primarias de FLVEH_T002...');
    
    // Verificar estructura actual
    console.log('\n📋 Estructura actual:');
    const [currentStructure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    currentStructure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Eliminar todas las claves primarias existentes
    console.log('\n📋 Eliminando claves primarias existentes...');
    try {
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_T002 DROP PRIMARY KEY');
      console.log('✅ Clave primaria eliminada');
    } catch (error) {
      console.log('⚠️  Error eliminando clave primaria:', error.message);
    }
    
    // Agregar clave primaria única
    console.log('\n📋 Agregando clave primaria única...');
    try {
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_T002 ADD PRIMARY KEY (id_item_revisado)');
      console.log('✅ Clave primaria única agregada');
    } catch (error) {
      console.log('❌ Error agregando clave primaria:', error.message);
    }
    
    // Verificar estructura final
    console.log('\n📋 Estructura final:');
    const [finalStructure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_T002');
    finalStructure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Extra ? `(${col.Extra})` : ''}`);
    });

    await connection.end();
    console.log('\n✅ Corrección de claves primarias completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixT002PrimaryKeys();
