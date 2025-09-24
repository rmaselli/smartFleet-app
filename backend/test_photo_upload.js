const mysql = require('mysql2/promise');
require('dotenv').config();

async function testPhotoUpload() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧪 Probando inserción de fotos...');
    
    // Crear una hoja de prueba si no existe
    console.log('\n📋 Creando hoja de prueba...');
    try {
      await connection.execute(`
        INSERT IGNORE INTO FLVEHI.FLVEH_T001 (
          id_hoja, id_empresa, id_plataforma, id_piloto, id_vehiculo, placa_id, 
          lectura_km_pic, lectura_km_txt, tipo_hoja, id_hoja_referencia, 
          lectura_km_num, id_vale, porcentaje_tanque, id_usuario, observaciones, 
          fe_registro, fe_modificacion, estado
        ) VALUES (999, 1, 'UBER', 1, 1, 'TEST123', 
          '', 0, 'S', 0, 1000, 
          NULL, 50, 'test_user', 'Hoja de prueba', 
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ING')
      `);
      console.log('✅ Hoja de prueba creada (ID: 999)');
    } catch (error) {
      console.log('Error creando hoja de prueba:', error.message);
    }

    // Probar inserción en FLVEH_F001
    console.log('\n📋 Probando inserción en FLVEH_F001...');
    try {
      const testPhoto = Buffer.from('test_image_data', 'utf8');
      
      await connection.execute(`
        INSERT INTO FLVEHI.FLVEH_F001 (
          id_hoja, id_empresa, tipo_hoja, foto, id_usuario, 
          fe_registro, fe_modificacion, estado, tipo_foto, 
          nombre_archivo, tamano_archivo, tipo_mime
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)
      `, [
        999, 1, 'S', testPhoto, 'test_user',
        'ING', 'frontal', 'test.jpg', 15, 'image/jpeg'
      ]);
      
      console.log('✅ Inserción en FLVEH_F001 exitosa');
    } catch (error) {
      console.log('Error insertando en FLVEH_F001:', error.message);
    }

    // Probar inserción en FLVEH_F002
    console.log('\n📋 Probando inserción en FLVEH_F002...');
    try {
      const testPhoto = Buffer.from('test_item_image_data', 'utf8');
      
      await connection.execute(`
        INSERT INTO FLVEHI.FLVEH_F002 (
          id_hoja, id_check, id_empresa, tipo_hoja, foto, id_usuario, 
          fe_registro, fe_modificacion, estado, nombre_archivo, tamano_archivo, tipo_mime
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?)
      `, [
        999, 1, 1, 'S', testPhoto, 'test_user',
        'ING', 'test_item.jpg', 20, 'image/jpeg'
      ]);
      
      console.log('✅ Inserción en FLVEH_F002 exitosa');
    } catch (error) {
      console.log('Error insertando en FLVEH_F002:', error.message);
    }

    // Verificar datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    
    const [f001Data] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F001 WHERE id_hoja = 999');
    console.log(`Fotos en FLVEH_F001: ${f001Data[0].count}`);
    
    const [f002Data] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F002 WHERE id_hoja = 999');
    console.log(`Fotos en FLVEH_F002: ${f002Data[0].count}`);

    // Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F001 WHERE id_hoja = 999');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F002 WHERE id_hoja = 999');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T001 WHERE id_hoja = 999');
    console.log('✅ Datos de prueba eliminados');

    await connection.end();
    console.log('\n✅ Prueba de inserción completada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPhotoUpload();
