const mysql = require('mysql2/promise');
require('dotenv').config();

async function testT002Insertion() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧪 Probando inserción en FLVEH_T002...');
    
    // Buscar una hoja existente
    const [hojas] = await connection.execute('SELECT id_hoja FROM FLVEHI.FLVEH_T001 ORDER BY id_hoja DESC LIMIT 1');
    
    if (hojas.length === 0) {
      console.log('❌ No hay hojas en FLVEH_T001');
      await connection.end();
      return;
    }
    
    const id_hoja = hojas[0].id_hoja;
    console.log(`📋 Usando hoja ID: ${id_hoja}`);
    
    // Probar inserción de múltiples items
    const items = [
      { id_check: 10, anotacion: 'Item 1 - Espejos' },
      { id_check: 11, anotacion: 'Item 2 - Faro delantero' },
      { id_check: 12, anotacion: 'Item 3 - Direccionales' }
    ];
    
    console.log('\n📋 Insertando items...');
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
    
    // Verificar registros insertados
    console.log('\n🔍 Verificando registros insertados...');
    const [records] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
    console.log(`Total de registros para hoja ${id_hoja}: ${records.length}`);
    
    records.forEach(record => {
      console.log(`  - ID: ${record.id_item_revisado}, Check: ${record.id_check}, Anotación: ${record.anotacion}`);
    });
    
    // Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
    console.log('✅ Datos de prueba eliminados');

    await connection.end();
    console.log('\n✅ Prueba de inserción completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testT002Insertion();
