const axios = require('axios');

async function testItemEndpoint() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando endpoint de inserción de items...');
    
    // 1. Login
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
    const hojaData = {
      id_plataforma: 'UBER',
      id_piloto: 1,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Hoja de prueba para items',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    const id_hoja = hojaResponse.data.data.id_hoja;
    console.log(`✅ Hoja creada con ID: ${id_hoja}`);
    
    // 3. Probar inserción de item individual
    console.log('\n📋 Probando inserción de item individual...');
    try {
      const itemResponse = await axios.post(`${baseURL}/hoja-es/item-revisado`, {
        id_hoja: parseInt(id_hoja),
        id_check: 10,
        anotacion: 'Prueba de item individual'
      }, { headers });
      
      console.log('✅ Item insertado exitosamente:', itemResponse.data);
    } catch (error) {
      console.log('❌ Error insertando item:', error.response?.data || error.message);
    }
    
    // 4. Verificar items insertados
    console.log('\n🔍 Verificando items insertados...');
    try {
      const itemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/${id_hoja}/items`, { headers });
      console.log(`Items encontrados: ${itemsResponse.data.total}`);
      itemsResponse.data.data.forEach(item => {
        console.log(`  - Item ${item.id_check}: ${item.anotacion}`);
      });
    } catch (error) {
      console.log('❌ Error obteniendo items:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Error en el flujo:', error.response?.data || error.message);
  }
}

testItemEndpoint();
