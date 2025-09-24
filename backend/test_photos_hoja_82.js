const axios = require('axios');

async function testPhotosHoja82() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando inserción de fotos para hoja 82...');
    
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
    
    // 2. Verificar que la hoja 82 existe
    console.log('\n📋 Paso 2: Verificando hoja 82...');
    try {
      const hojaResponse = await axios.get(`${baseURL}/hoja-es/hoja/82/items`, { headers });
      console.log('✅ Hoja 82 accesible');
    } catch (error) {
      console.log('❌ Error accediendo a hoja 82:', error.response?.data || error.message);
    }
    
    // 3. Probar inserción de fotos de motocicleta
    console.log('\n📋 Paso 3: Probando inserción de fotos de motocicleta...');
    const fotosMotocicleta = [
      { tipo_foto: 'frontal', foto: 'data:image/jpeg;base64,test_frontal_data_82' },
      { tipo_foto: 'lateral_derecha', foto: 'data:image/jpeg;base64,test_lateral_derecha_data_82' },
      { tipo_foto: 'lateral_izquierda', foto: 'data:image/jpeg;base64,test_lateral_izquierda_data_82' },
      { tipo_foto: 'trasero', foto: 'data:image/jpeg;base64,test_trasero_data_82' },
      { tipo_foto: 'odometro', foto: 'data:image/jpeg;base64,test_odometro_data_82' }
    ];
    
    try {
      const fotosResponse = await axios.post(`${baseURL}/hoja-es/subir-fotos`, {
        id_hoja: 82,
        fotos: fotosMotocicleta
      }, { headers });
      console.log('✅ Fotos de motocicleta insertadas:', fotosResponse.data);
    } catch (error) {
      console.log('❌ Error insertando fotos de motocicleta:', error.response?.data || error.message);
    }
    
    // 4. Verificar fotos insertadas
    console.log('\n📋 Paso 4: Verificando fotos insertadas...');
    try {
      const fotosResponse = await axios.get(`${baseURL}/hoja-es/hoja/82/fotos`, { headers });
      console.log(`Fotos de motocicleta: ${fotosResponse.data.total}`);
      fotosResponse.data.data.forEach(foto => {
        console.log(`  - Tipo: ${foto.tipo_foto}, Estado: ${foto.estado}`);
      });
    } catch (error) {
      console.log('❌ Error obteniendo fotos:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Prueba completada');
    
  } catch (error) {
    console.error('Error en el flujo:', error.response?.data || error.message);
  }
}

testPhotosHoja82();
