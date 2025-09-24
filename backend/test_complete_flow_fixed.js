const axios = require('axios');

async function testCompleteFlowFixed() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando flujo completo con estructura corregida...');
    
    // 1. Login para obtener token
    console.log('\n📋 Paso 1: Haciendo login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'testuser',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Obtener siguiente número de hoja
    console.log('\n📋 Paso 2: Obteniendo siguiente número de hoja...');
    const siguienteHojaResponse = await axios.get(`${baseURL}/hoja-es/siguiente-hoja`, { headers });
    const id_hoja = siguienteHojaResponse.data.data.id_hoja;
    console.log(`✅ ID de hoja generado: ${id_hoja}`);
    
    // 3. Crear hoja principal
    console.log('\n📋 Paso 3: Creando hoja principal...');
    const hojaData = {
      id_plataforma: 'UBER',
      id_piloto: 1,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Hoja de prueba con estructura corregida',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    console.log('✅ Hoja principal creada');
    
    // 4. Agregar items revisados (3 items como mencionaste)
    console.log('\n📋 Paso 4: Agregando 3 items revisados...');
    const items = [
      { id_check: 10, anotacion: 'Item 1 revisado - Espejos' },
      { id_check: 11, anotacion: 'Item 2 revisado - Faro delantero' },
      { id_check: 12, anotacion: 'Item 3 revisado - Direccionales' }
    ];
    
    for (const item of items) {
      try {
        const response = await axios.post(`${baseURL}/hoja-es/item-revisado`, {
          id_hoja: parseInt(id_hoja),
          id_check: item.id_check,
          anotacion: item.anotacion
        }, { headers });
        console.log(`  ✅ Item ${item.id_check} (${item.anotacion}) agregado exitosamente`);
      } catch (error) {
        console.log(`  ❌ Error agregando item ${item.id_check}:`, error.response?.data || error.message);
      }
    }
    
    // 5. Subir fotos de motocicleta
    console.log('\n📋 Paso 5: Subiendo fotos de motocicleta...');
    const fotosMotocicleta = [
      { tipo_foto: 'frontal', foto: 'data:image/jpeg;base64,test_frontal_data' },
      { tipo_foto: 'lateral_derecha', foto: 'data:image/jpeg;base64,test_lateral_derecha_data' },
      { tipo_foto: 'lateral_izquierda', foto: 'data:image/jpeg;base64,test_lateral_izquierda_data' },
      { tipo_foto: 'trasero', foto: 'data:image/jpeg;base64,test_trasero_data' },
      { tipo_foto: 'odometro', foto: 'data:image/jpeg;base64,test_odometro_data' }
    ];
    
    try {
      await axios.post(`${baseURL}/hoja-es/subir-fotos`, {
        id_hoja: parseInt(id_hoja),
        fotos: fotosMotocicleta
      }, { headers });
      console.log('✅ Fotos de motocicleta subidas exitosamente');
    } catch (error) {
      console.log('❌ Error subiendo fotos de motocicleta:', error.response?.data || error.message);
    }
    
    // 6. Subir fotos de items
    console.log('\n📋 Paso 6: Subiendo fotos de items...');
    for (const item of items) {
      try {
        await axios.post(`${baseURL}/hoja-es/subir-foto-item`, {
          id_hoja: parseInt(id_hoja),
          id_check: item.id_check,
          foto: `data:image/jpeg;base64,test_item_${item.id_check}_data`,
          nombre_archivo: `item_${item.id_check}.jpg`,
          tamano_archivo: 25,
          tipo_mime: 'image/jpeg'
        }, { headers });
        console.log(`  ✅ Foto del item ${item.id_check} subida exitosamente`);
      } catch (error) {
        console.log(`  ❌ Error subiendo foto del item ${item.id_check}:`, error.response?.data || error.message);
      }
    }
    
    // 7. Verificar datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    
    try {
      const fotosResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos`, { headers });
      console.log(`  📸 Fotos de motocicleta: ${fotosResponse.data.total} fotos`);
    } catch (error) {
      console.log('  ❌ Error obteniendo fotos de motocicleta:', error.response?.data || error.message);
    }
    
    try {
      const fotosItemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos-items`, { headers });
      console.log(`  📸 Fotos de items: ${fotosItemsResponse.data.total} fotos`);
    } catch (error) {
      console.log('  ❌ Error obteniendo fotos de items:', error.response?.data || error.message);
    }
    
    try {
      const itemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/items`, { headers });
      console.log(`  📝 Items revisados: ${itemsResponse.data.total} items`);
      itemsResponse.data.data.forEach(item => {
        console.log(`    - Item ${item.id_check}: ${item.anotacion}`);
      });
    } catch (error) {
      console.log('  ❌ Error obteniendo items revisados:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Flujo completo probado exitosamente');
    
  } catch (error) {
    console.error('Error en el flujo:', error.response?.data || error.message);
  }
}

testCompleteFlowFixed();
