const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testCheckMaster() {
  try {
    console.log('🚀 Iniciando prueba de check master...\n');

    // 1. Probar login
    console.log('1️⃣ Probando login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login exitoso');
    const token = loginResponse.data.token;
    
    // 2. Probar endpoint de check master
    console.log('\n2️⃣ Probando endpoint de check master...');
    const checkMasterResponse = await axios.get(`${API_BASE}/api/check-master`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Check master obtenidos exitosamente');
    console.log('📊 Total de registros:', checkMasterResponse.data.total);
    console.log('📋 Success:', checkMasterResponse.data.success);
    
    // 3. Probar creación de nuevo check master
    console.log('\n3️⃣ Probando creación de check master...');
    const newCheckMaster = {
      id_empresa: 1,
      tipo_check: 'Preventivo',
      tipo_vehiculo: 1,
      desc_check: 'Check Master de Prueba',
      id_piloto_default: 1,
      cod_abreviado: 'TEST222',
      estado: 'ACT',
      observaciones: 'Registro de prueba'
    };
    
    console.log('📋 Datos a enviar:', newCheckMaster);
    
    const createResponse = await axios.post(`${API_BASE}/api/check-master`, newCheckMaster, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Check master creado exitosamente');
    console.log('📋 Response:', createResponse.data);
    console.log('🆔 ID del nuevo registro:', createResponse.data.data?.id_check);
    
    // 4. Verificar que el registro se guardó
    console.log('\n4️⃣ Verificando que el registro se guardó...');
    const verifyResponse = await axios.get(`${API_BASE}/api/check-master`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const newRecord = verifyResponse.data.data.find(item => item.cod_abreviado === 'TEST');
    if (newRecord) {
      console.log('✅ Registro encontrado en la base de datos');
      console.log('📋 Descripción:', newRecord.desc_check);
      console.log('📋 ID:', newRecord.id_check);
    } else {
      console.log('❌ Registro NO encontrado en la base de datos');
    }
    
    console.log('\n🎉 Todas las pruebas completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📋 Data:', error.response.data);
    }
  }
}

// Ejecutar las pruebas
testCheckMaster();
