const axios = require('axios');

async function testCompleteBackendFlow() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando flujo completo desde backend...');
    
    // 1. Login
    console.log('\n📋 Paso 1: Login...');
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
    
    // 2. Crear hoja
    console.log('\n📋 Paso 2: Creando hoja...');
    const hojaData = {
      id_plataforma: 'UBER',
      id_piloto: 1,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Hoja de prueba completa',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    const id_hoja = hojaResponse.data.data.id_hoja;
    console.log(`✅ Hoja creada con ID: ${id_hoja}`);
    
    // 3. Insertar 3 items revisados
    console.log('\n📋 Paso 3: Insertando 3 items revisados...');
    const items = [
      { id_check: 10, anotacion: 'Espejos revisados - OK' },
      { id_check: 11, anotacion: 'Faro delantero revisado - OK' },
      { id_check: 12, anotacion: 'Direccionales revisadas - OK' }
    ];
    
    for (const item of items) {
      try {
        const response = await axios.post(`${baseURL}/hoja-es/item-revisado`, {
          id_hoja: parseInt(id_hoja),
          id_check: item.id_check,
          anotacion: item.anotacion
        }, { headers });
        console.log(`  ✅ Item ${item.id_check} insertado: ${item.anotacion}`);
      } catch (error) {
        console.log(`  ❌ Error insertando item ${item.id_check}:`, error.response?.data || error.message);
      }
    }
    
    // 4. Verificar items insertados
    console.log('\n📋 Paso 4: Verificando items insertados...');
    try {
      const itemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/items`, { headers });
      console.log(`Total de items: ${itemsResponse.data.total}`);
      itemsResponse.data.data.forEach(item => {
        console.log(`  - Item ${item.id_check}: ${item.anotacion}`);
      });
    } catch (error) {
      console.log('❌ Error obteniendo items:', error.response?.data || error.message);
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
      console.log('✅ Fotos de motocicleta subidas');
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
        console.log(`  ✅ Foto del item ${item.id_check} subida`);
      } catch (error) {
        console.log(`  ❌ Error subiendo foto del item ${item.id_check}:`, error.response?.data || error.message);
      }
    }
    
    // 7. Verificar fotos
    console.log('\n📋 Paso 7: Verificando fotos...');
    try {
      const fotosResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos`, { headers });
      console.log(`Fotos de motocicleta: ${fotosResponse.data.total}`);
    } catch (error) {
      console.log('❌ Error obteniendo fotos de motocicleta:', error.response?.data || error.message);
    }
    
    try {
      const fotosItemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos-items`, { headers });
      console.log(`Fotos de items: ${fotosItemsResponse.data.total}`);
    } catch (error) {
      console.log('❌ Error obteniendo fotos de items:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Flujo completo probado exitosamente');
    
  } catch (error) {
    console.error('Error en el flujo:', error.response?.data || error.message);
  }
}

testCompleteBackendFlow();
