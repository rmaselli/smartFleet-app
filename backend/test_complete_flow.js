const mysql = require('mysql2/promise');
require('dotenv').config();

async function testCompleteFlow() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧪 Probando flujo completo del id_hoja...');
    
    // 1. Obtener siguiente número de hoja
    console.log('\n📋 Paso 1: Obteniendo siguiente número de hoja...');
    try {
      await connection.execute('CALL sql_get_seq_num(1, "HOJASA", @v_seqnum)');
      const [result] = await connection.execute('SELECT @v_seqnum as siguiente_numero');
      const id_hoja = result[0].siguiente_numero;
      console.log(`✅ ID de hoja generado: ${id_hoja}`);
      
      // 2. Crear hoja en FLVEH_T001
      console.log('\n📋 Paso 2: Creando hoja en FLVEH_T001...');
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
          null, 50, 1, 'Hoja de prueba', 'ING'
        ]
      );
      console.log(`✅ Hoja creada en FLVEH_T001 con ID: ${id_hoja}`);
      
      // 3. Agregar items revisados en FLVEH_T002
      console.log('\n📋 Paso 3: Agregando items revisados en FLVEH_T002...');
      const items = [
        { id_check: 10, anotacion: 'Item 1 revisado' },
        { id_check: 11, anotacion: 'Item 2 revisado' }
      ];
      
      for (const item of items) {
        await connection.execute(
          `INSERT INTO FLVEHI.FLVEH_T002 (
            id_hoja, id_empresa, id_check, anotacion, id_usuario, 
            tiempo_inicio, tiempo_final, fe_registro, fe_modificacion, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
          [
            id_hoja, 1, item.id_check, item.anotacion, 1,
            '', '', 'ING'
          ]
        );
        console.log(`  ✅ Item ${item.id_check} agregado`);
      }
      
      // 4. Agregar fotos de motocicleta en FLVEH_F001
      console.log('\n📋 Paso 4: Agregando fotos de motocicleta en FLVEH_F001...');
      const fotosMotocicleta = [
        { tipo_foto: 'frontal', nombre: 'frontal.jpg' },
        { tipo_foto: 'lateral_derecha', nombre: 'lateral_derecha.jpg' },
        { tipo_foto: 'lateral_izquierda', nombre: 'lateral_izquierda.jpg' },
        { tipo_foto: 'trasero', nombre: 'trasero.jpg' },
        { tipo_foto: 'odometro', nombre: 'odometro.jpg' }
      ];
      
      for (const foto of fotosMotocicleta) {
        const testPhoto = Buffer.from(`test_${foto.tipo_foto}_data`, 'utf8');
        await connection.execute(
          `INSERT INTO FLVEHI.FLVEH_F001 (
            id_hoja, id_empresa, tipo_hoja, foto, id_usuario, 
            fe_registro, fe_modificacion, estado, tipo_foto, 
            nombre_archivo, tamano_archivo, tipo_mime
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)`,
          [
            id_hoja, 1, 'S', testPhoto, 1,
            'ING', foto.tipo_foto, foto.nombre, 20, 'image/jpeg'
          ]
        );
        console.log(`  ✅ Foto ${foto.tipo_foto} agregada`);
      }
      
      // 5. Agregar fotos de items en FLVEH_F002
      console.log('\n📋 Paso 5: Agregando fotos de items en FLVEH_F002...');
      for (const item of items) {
        const testPhoto = Buffer.from(`test_item_${item.id_check}_data`, 'utf8');
        await connection.execute(
          `INSERT INTO FLVEHI.FLVEH_F002 (
            id_hoja, id_check, id_empresa, tipo_hoja, foto, id_usuario, 
            fe_registro, fe_modificacion, estado, nombre_archivo, tamano_archivo, tipo_mime
          ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
          [
            id_hoja, item.id_check, 1, 'S', testPhoto, 1,
            'ING', `item_${item.id_check}.jpg`, 25, 'image/jpeg'
          ]
        );
        console.log(`  ✅ Foto del item ${item.id_check} agregada`);
      }
      
      // 6. Verificar datos insertados
      console.log('\n🔍 Verificando datos insertados...');
      
      const [t001Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T001 WHERE id_hoja = ?', [id_hoja]);
      console.log(`  FLVEH_T001: ${t001Count[0].count} registro(s)`);
      
      const [t002Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
      console.log(`  FLVEH_T002: ${t002Count[0].count} registro(s)`);
      
      const [f001Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F001 WHERE id_hoja = ?', [id_hoja]);
      console.log(`  FLVEH_F001: ${f001Count[0].count} registro(s)`);
      
      const [f002Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F002 WHERE id_hoja = ?', [id_hoja]);
      console.log(`  FLVEH_F002: ${f002Count[0].count} registro(s)`);
      
      // 7. Limpiar datos de prueba
      console.log('\n🧹 Limpiando datos de prueba...');
      await connection.execute('DELETE FROM FLVEHI.FLVEH_F002 WHERE id_hoja = ?', [id_hoja]);
      await connection.execute('DELETE FROM FLVEHI.FLVEH_F001 WHERE id_hoja = ?', [id_hoja]);
      await connection.execute('DELETE FROM FLVEHI.FLVEH_T002 WHERE id_hoja = ?', [id_hoja]);
      await connection.execute('DELETE FROM FLVEHI.FLVEH_T001 WHERE id_hoja = ?', [id_hoja]);
      console.log('✅ Datos de prueba eliminados');
      
      console.log('\n✅ Flujo completo del id_hoja probado exitosamente');
      
    } catch (error) {
      console.log('Error en el flujo:', error.message);
    }

    await connection.end();
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
}

testCompleteFlow();
