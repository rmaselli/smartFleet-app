const axios = require('axios');

async function simulateFrontendFlow() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Simulando flujo completo del frontend...');
    
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
    
    // 2. Obtener siguiente número de hoja
    console.log('\n📋 Paso 2: Obteniendo siguiente número de hoja...');
    const siguienteHojaResponse = await axios.get(`${baseURL}/hoja-es/siguiente-hoja`, { headers });
    const id_hoja = siguienteHojaResponse.data.data.id_hoja;
    console.log(`✅ Siguiente hoja: ${id_hoja}`);
    
    // 3. Crear hoja principal
    console.log('\n📋 Paso 3: Creando hoja principal...');
    const hojaData = {
      id_plataforma: 'YANGO',
      id_piloto: 4,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Simulación de flujo frontend',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    console.log('✅ Hoja creada:', hojaResponse.data);
    
    // 4. Agregar items revisados
    console.log('\n📋 Paso 4: Agregando items revisados...');
    const items = [
      { id_check: 10, anotacion: 'Espejos revisados - OK' },
      { id_check: 11, anotacion: 'Faro delantero revisado - OK' },
      { id_check: 12, anotacion: 'Direccionales revisadas - OK' }
    ];
    
    for (const item of items) {
      try {
        const response = await axios.post(`${baseURL}/hoja-es/item-revisado`, {
          id_hoja,
          id_check: item.id_check,
          anotacion: item.anotacion
        }, { headers });
        console.log(`  ✅ Item ${item.id_check} agregado`);
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
      const fotosResponse = await axios.post(`${baseURL}/hoja-es/subir-fotos`, {
        id_hoja,
        fotos: fotosMotocicleta
      }, { headers });
      console.log('✅ Fotos de motocicleta subidas:', fotosResponse.data);
    } catch (error) {
      console.log('❌ Error subiendo fotos de motocicleta:', error.response?.data || error.message);
    }
    
    // 6. Subir fotos de items
    console.log('\n📋 Paso 6: Subiendo fotos de items...');
    for (const item of items) {
      try {
        await axios.post(`${baseURL}/hoja-es/subir-foto-item`, {
          id_hoja,
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
    
    // 7. Verificar resultado final
    console.log('\n📋 Paso 7: Verificando resultado final...');
    
    // Verificar items
    const itemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/items`, { headers });
    console.log(`Items revisados: ${itemsResponse.data.total}`);
    
    // Verificar fotos de motocicleta
    const fotosResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos`, { headers });
    console.log(`Fotos de motocicleta: ${fotosResponse.data.total}`);
    
    // Verificar fotos de items
    const fotosItemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/fotos-items`, { headers });
    console.log(`Fotos de items: ${fotosItemsResponse.data.total}`);
    
    console.log('\n✅ Simulación del flujo frontend completada exitosamente');
    
  } catch (error) {
    console.error('Error en la simulación:', error.response?.data || error.message);
  }
}

simulateFrontendFlow();
