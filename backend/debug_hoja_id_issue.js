const axios = require('axios');

async function debugHojaIdIssue() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🔍 Debuggeando problema de ID de hoja...');
    
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
    
    // 2. Obtener siguiente número de hoja
    console.log('\n📋 Obteniendo siguiente número de hoja...');
    const siguienteHojaResponse = await axios.get(`${baseURL}/hoja-es/siguiente-hoja`, { headers });
    const id_hoja_obtenido = siguienteHojaResponse.data.data.id_hoja;
    console.log(`ID de hoja obtenido: ${id_hoja_obtenido} (tipo: ${typeof id_hoja_obtenido})`);
    
    // 3. Crear hoja principal
    console.log('\n📋 Creando hoja principal...');
    const hojaData = {
      id_plataforma: 'YANGO',
      id_piloto: 4,
      id_vehiculo: 1,
      placa_id: 'TEST123',
      lectura_km_num: 1000,
      observaciones: 'Debug de ID de hoja',
      porcentaje_tanque: 50
    };
    
    const hojaResponse = await axios.post(`${baseURL}/hoja-es/hoja`, hojaData, { headers });
    const id_hoja_creado = hojaResponse.data.data.id_hoja;
    console.log(`ID de hoja creado: ${id_hoja_creado} (tipo: ${typeof id_hoja_creado})`);
    
    // 4. Verificar si los IDs coinciden
    console.log('\n📋 Verificando coincidencia de IDs...');
    if (id_hoja_obtenido === id_hoja_creado) {
      console.log('✅ Los IDs coinciden');
    } else {
      console.log('❌ Los IDs NO coinciden');
      console.log(`  Obtenido: ${id_hoja_obtenido}`);
      console.log(`  Creado: ${id_hoja_creado}`);
    }
    
    // 5. Probar inserción de item con el ID correcto
    console.log('\n📋 Probando inserción de item con ID correcto...');
    try {
      const itemResponse = await axios.post(`${baseURL}/hoja-es/item-revisado`, {
        id_hoja: id_hoja_creado, // Usar el ID que realmente se creó
        id_check: 10,
        anotacion: 'Item de prueba'
      }, { headers });
      console.log('✅ Item insertado correctamente:', itemResponse.data);
    } catch (error) {
      console.log('❌ Error insertando item:', error.response?.data || error.message);
    }
    
    // 6. Probar inserción de fotos con el ID correcto
    console.log('\n📋 Probando inserción de fotos con ID correcto...');
    try {
      const fotosResponse = await axios.post(`${baseURL}/hoja-es/subir-fotos`, {
        id_hoja: id_hoja_creado, // Usar el ID que realmente se creó
        fotos: [
          { tipo_foto: 'frontal', foto: 'data:image/jpeg;base64,test_data' }
        ]
      }, { headers });
      console.log('✅ Fotos insertadas correctamente:', fotosResponse.data);
    } catch (error) {
      console.log('❌ Error insertando fotos:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Error en debug:', error.response?.data || error.message);
  }
}

debugHojaIdIssue();
