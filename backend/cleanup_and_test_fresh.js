const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

async function cleanupAndTestFresh() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🧹 Limpiando tablas y probando flujo fresco...');
    
    // 1. Limpiar todas las tablas
    console.log('\n📋 Paso 1: Limpiando tablas...');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F002');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_F001');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T002');
    await connection.execute('DELETE FROM FLVEHI.FLVEH_T001');
    console.log('✅ Tablas limpiadas');
    
    // 2. Verificar que están vacías
    console.log('\n📋 Paso 2: Verificando tablas vacías...');
    const [t001Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T001');
    const [t002Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_T002');
    const [f001Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F001');
    const [f002Count] = await connection.execute('SELECT COUNT(*) as count FROM FLVEHI.FLVEH_F002');
    
    console.log(`  FLVEH_T001: ${t001Count[0].count} registros`);
    console.log(`  FLVEH_T002: ${t002Count[0].count} registros`);
    console.log(`  FLVEH_F001: ${f001Count[0].count} registros`);
    console.log(`  FLVEH_F002: ${f002Count[0].count} registros`);
    
    await connection.end();
    
    // 3. Esperar un momento para que el servidor esté listo
    console.log('\n📋 Paso 3: Esperando servidor...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Probar flujo completo
    console.log('\n📋 Paso 4: Probando flujo completo...');
    const baseURL = 'http://localhost:5000/api';
    
    // Login
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'testuser',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Login exitoso');
    
    // Crear hoja
    const hojaData = {
      id_plataforma: 'YANGO',
      id_piloto: 4,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Hoja de prueba fresca',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    const id_hoja = hojaResponse.data.data.id_hoja;
    console.log(`✅ Hoja creada con ID: ${id_hoja}`);
    
    // Agregar items revisados
    const items = [
      { id_check: 10, anotacion: 'Espejos revisados - OK' },
      { id_check: 11, anotacion: 'Faro delantero revisado - OK' },
      { id_check: 12, anotacion: 'Direccionales revisadas - OK' }
    ];
    
    for (const item of items) {
      await axios.post(`${baseURL}/hoja-es/item-revisado`, {
        id_hoja,
        id_check: item.id_check,
        anotacion: item.anotacion
      }, { headers });
      console.log(`  ✅ Item ${item.id_check} agregado`);
    }
    
    // Subir fotos de motocicleta
    const fotosMotocicleta = [
      { tipo_foto: 'frontal', foto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' },
      { tipo_foto: 'lateral_derecha', foto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' },
      { tipo_foto: 'lateral_izquierda', foto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' },
      { tipo_foto: 'trasero', foto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' },
      { tipo_foto: 'odometro', foto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' }
    ];
    
    await axios.post(`${baseURL}/hoja-es/subir-fotos`, {
      id_hoja,
      fotos: fotosMotocicleta
    }, { headers });
    console.log('✅ Fotos de motocicleta subidas');
    
    // Subir fotos de items
    for (const item of items) {
      await axios.post(`${baseURL}/hoja-es/subir-foto-item`, {
        id_hoja,
        id_check: item.id_check,
        foto: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`,
        nombre_archivo: `item_${item.id_check}.jpg`,
        tamano_archivo: 25,
        tipo_mime: 'image/jpeg'
      }, { headers });
      console.log(`  ✅ Foto del item ${item.id_check} subida`);
    }
    
    // 5. Probar endpoint de fotos para autorización
    console.log('\n📋 Paso 5: Probando endpoint de fotos para autorización...');
    const fotosResponse = await axios.get(`${baseURL}/hoja-es/autorizacion/hoja/${id_hoja}/fotos`, { headers });
    console.log('✅ Respuesta del endpoint:', {
      success: fotosResponse.data.success,
      total_motocicleta: fotosResponse.data.total.motocicleta,
      total_items: fotosResponse.data.total.items
    });
    
    if (fotosResponse.data.data.fotos_motocicleta.length > 0) {
      const primeraFoto = fotosResponse.data.data.fotos_motocicleta[0];
      console.log('📸 Primera foto de motocicleta:');
      console.log(`  - ID: ${primeraFoto.id_foto}`);
      console.log(`  - Tipo: ${primeraFoto.tipo_foto}`);
      console.log(`  - Tiene foto_base64: ${!!primeraFoto.foto_base64}`);
      console.log(`  - Longitud: ${primeraFoto.foto_base64 ? primeraFoto.foto_base64.length : 0}`);
      console.log(`  - Inicio: ${primeraFoto.foto_base64 ? primeraFoto.foto_base64.substring(0, 50) + '...' : 'N/A'}`);
    }
    
    console.log('\n✅ Flujo completo probado exitosamente');
    console.log(`\n🎯 Hoja de prueba creada con ID: ${id_hoja}`);
    console.log('Ahora puedes probar el modal de fotos con esta hoja fresca.');
    
  } catch (error) {
    console.error('Error en el flujo:', error.response?.data || error.message);
  }
}

cleanupAndTestFresh();
