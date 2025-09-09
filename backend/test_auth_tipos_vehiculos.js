const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testAuthAndTiposVehiculos() {
  try {
    console.log('🚀 Iniciando prueba de autenticación y tipos de vehículos...\n');

    // 1. Probar login
    console.log('1️⃣ Probando login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login exitoso');
    console.log('📋 Token recibido:', loginResponse.data.token ? 'Sí' : 'No');
    console.log('👤 Usuario:', loginResponse.data.user?.username);
    
    const token = loginResponse.data.token;
    
    // 2. Probar endpoint de tipos de vehículos con autenticación
    console.log('\n2️⃣ Probando endpoint de tipos de vehículos...');
    const tiposResponse = await axios.get(`${API_BASE}/api/tipos-vehiculos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Tipos de vehículos obtenidos exitosamente');
    console.log('📊 Total de registros:', tiposResponse.data.total);
    console.log('📋 Datos:', tiposResponse.data.data?.length > 0 ? 'Sí' : 'No');
    
    // 3. Probar creación de nuevo tipo de vehículo
    console.log('\n3️⃣ Probando creación de tipo de vehículo...');
    const newTipoVehiculo = {
      id_empresa: 1,
      cod_vehiculo: 999,
      cod_abreviado: 'TEST',
      desc_tipo_vehiculo: 'Tipo de Prueba',
      tipo_vehiculo: 'LOC',
      observaciones: 'Registro de prueba'
    };
    
    const createResponse = await axios.post(`${API_BASE}/api/tipos-vehiculos`, newTipoVehiculo, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Tipo de vehículo creado exitosamente');
    console.log('🆔 ID del nuevo registro:', createResponse.data.data?.id_tipo_vehiculo);
    
    // 4. Verificar que el registro se guardó
    console.log('\n4️⃣ Verificando que el registro se guardó...');
    const verifyResponse = await axios.get(`${API_BASE}/api/tipos-vehiculos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const newRecord = verifyResponse.data.data.find(item => item.cod_vehiculo === 999);
    if (newRecord) {
      console.log('✅ Registro encontrado en la base de datos');
      console.log('📋 Descripción:', newRecord.desc_tipo_vehiculo);
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
testAuthAndTiposVehiculos();

