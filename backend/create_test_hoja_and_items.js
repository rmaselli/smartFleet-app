const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTestHojaAndItems() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧪 Creando hoja de prueba y probando inserción de items...');
    
    // 1. Crear una hoja de prueba en T001
    console.log('\n📋 Paso 1: Creando hoja de prueba en FLVEH_T001...');
    const id_hoja = 1000; // ID fijo para prueba
    
    try {
      await connection.execute(
        `INSERT INTO FLVEHI.FLVEH_T001 (
          id_hoja, id_empresa, id_plataforma, id_piloto, id_vehiculo, placa_id, 
          lectura_km_pic, lectura_km_txt, tipo_hoja, id_hoja_referencia, 
          lectura_km_num, id_vale, porcentaje_tanque, id_usuario, observaciones, 
          fe_registro, fe_modificacion, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
        [
          id_hoja, 1, 'UBER', 1, 1, 'TEST123',
          '', 0, 'S', 0, 1000,
          null, 50, 1, 'Hoja de prueba para T002', 'ING'
        ]
      );
      console.log(`✅ Hoja creada con ID: ${id_hoja}`);
    } catch (error) {
      console.log('❌ Error creando hoja:', error.message);
      await connection.end();
      return;
    }
    
    // 2. Probar inserción de múltiples items en T002
    console.log('\n📋 Paso 2: Insertando múltiples items en FLVEH_T002...');
    const items = [
      { id_check: 10, anotacion: 'Item 1 - Espejos revisados' },
      { id_check: 11, anotacion: 'Item 2 - Faro delantero revisado' },
      { id_check: 12, anotacion: 'Item 3 - Direccionales revisadas' }
    ];
    
    for (const item of items) {
      try {
        await connection.execute(
          `INSERT INTO FLVEHI.FLVEH_T002 (
            id_hoja, id_empresa, id_check, anotacion, id_usuario, 
            tiempo_inicio, tiempo_final, fe_registro, fe_modificacion, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
          [id_hoja, 1, item.id_check, item.anotacion, 1, '', '', 'ING']
        );
        console.log(`  ✅ Item ${item.id_check} insertado: ${item.anotacion}`);
      } catch (error) {
        console.log(`  ❌ Error insertando item ${item.id_check}:`, error.message);
      }
    }
    
    // 3. Verificar registros insertados
    console.log('\n🔍 Paso 3: Verificando registros insertados...');
    const [t001Records] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T001 WHERE id_hoja = ?', [id_hoja]);
    console.log(`Registros en FLVEH_T001: ${t001Records[0].count}`);
    
    const [t002Records] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
    console.log(`Registros en FLVEH_T002: ${t002Records[0].count}`);
    
    if (t002Records[0].count > 0) {
      const [items] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
      console.log('\nItems insertados:');
      items.forEach(item => {
        console.log(`  - ID: ${item.id_item_revisado}, Check: ${item.id_check}, Anotación: ${item.anotacion}`);
      });
    }
    
    // 4. Limpiar datos de prueba
    console.log('\n🧹 Paso 4: Limpiando datos de prueba...');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T001 WHERE id_hoja = ?', [id_hoja]);
    console.log('✅ Datos de prueba eliminados');

    await connection.end();
    console.log('\n✅ Prueba completada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTestHojaAndItems();
