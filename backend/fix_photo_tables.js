const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPhotoTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔧 Actualizando estructura de tablas de fotos...');
    
    // Actualizar FLVEH_F001
    console.log('\n📋 Actualizando FLVEH_F001...');
    try {
      // Agregar columnas faltantes
      await connection.execute(`
        ALTER TABLE FLVEHI.FLVEH_F001 
        ADD COLUMN IF NOT EXISTS tipo_foto ENUM('lateral_derecha', 'lateral_izquierda', 'frontal', 'trasero', 'odometro') NOT NULL AFTER estado,
        ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(255) AFTER tipo_foto,
        ADD COLUMN IF NOT EXISTS tamano_archivo INT AFTER nombre_archivo,
        ADD COLUMN IF NOT EXISTS tipo_mime VARCHAR(50) AFTER tamano_archivo
      `);
      
      // Cambiar la clave primaria
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 DROP PRIMARY KEY');
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 ADD PRIMARY KEY (id_foto)');
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 MODIFY id_foto INT AUTO_INCREMENT');
      
      // Hacer foto NOT NULL
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F001 MODIFY foto LONGBLOB NOT NULL');
      
      console.log('✅ FLVEH_F001 actualizada correctamente');
    } catch (error) {
      console.log('Error actualizando FLVEH_F001:', error.message);
    }

    // Actualizar FLVEH_F002
    console.log('\n📋 Actualizando FLVEH_F002...');
    try {
      // Agregar columnas faltantes
      await connection.execute(`
        ALTER TABLE FLVEHI.FLVEH_F002 
        ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(255) AFTER estado,
        ADD COLUMN IF NOT EXISTS tamano_archivo INT AFTER nombre_archivo,
        ADD COLUMN IF NOT EXISTS tipo_mime VARCHAR(50) AFTER tamano_archivo
      `);
      
      // Cambiar la clave primaria
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 DROP PRIMARY KEY');
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 ADD PRIMARY KEY (id_foto)');
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 MODIFY id_foto INT AUTO_INCREMENT');
      
      // Hacer foto NOT NULL
      await connection.execute('ALTER TABLE FLVEHI.FLVEH_F002 MODIFY foto LONGBLOB NOT NULL');
      
      console.log('✅ FLVEH_F002 actualizada correctamente');
    } catch (error) {
      console.log('Error actualizando FLVEH_F002:', error.message);
    }

    // Verificar estructura final
    console.log('\n🔍 Verificando estructura final...');
    
    console.log('\n📋 FLVEH_F001 final:');
    const [f001Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F001');
    f001Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    console.log('\n📋 FLVEH_F002 final:');
    const [f002Structure] = await connection.execute('DESCRIBE FLVEHI.FLVEH_F002');
    f002Structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    await connection.end();
    console.log('\n✅ Actualización completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixPhotoTables();
