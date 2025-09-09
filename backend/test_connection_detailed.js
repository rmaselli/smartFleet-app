const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testConnection() {
  try {
    console.log('🔍 Iniciando diagnóstico de conexión...\n');

    // 1. Probar health check
    console.log('1️⃣ Probando health check...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/api/health`, {
        timeout: 5000
      });
      console.log('✅ Health check exitoso');
      console.log('📋 Status:', healthResponse.status);
      console.log('📋 Data:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check falló:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 El servidor no está ejecutándose en el puerto 5000');
        return;
      }
    }

    // 2. Probar login con credenciales de prueba
    console.log('\n2️⃣ Probando login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        username: 'admin',
        password: 'admin123'
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Login exitoso');
      console.log('📋 Status:', loginResponse.status);
      console.log('📋 Token recibido:', loginResponse.data.token ? 'Sí' : 'No');
      console.log('👤 Usuario:', loginResponse.data.user?.username);
      
      const token = loginResponse.data.token;
      
      // 3. Probar endpoint de tipos de vehículos
      console.log('\n3️⃣ Probando endpoint de tipos de vehículos...');
      try {
        const tiposResponse = await axios.get(`${API_BASE}/api/tipos-vehiculos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        
        console.log('✅ Tipos de vehículos obtenidos exitosamente');
        console.log('📋 Status:', tiposResponse.status);
        console.log('📊 Total de registros:', tiposResponse.data.total);
        console.log('📋 Success:', tiposResponse.data.success);
        
      } catch (tiposError) {
        console.log('❌ Error en tipos de vehículos:', tiposError.message);
        if (tiposError.response) {
          console.log('📋 Status:', tiposError.response.status);
          console.log('📋 Data:', tiposError.response.data);
        }
      }
      
    } catch (loginError) {
      console.log('❌ Error en login:', loginError.message);
      if (loginError.response) {
        console.log('📋 Status:', loginError.response.status);
        console.log('📋 Data:', loginError.response.data);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 El servidor no está ejecutándose. Ejecuta: npm start');
    }
  }
}

// Ejecutar el diagnóstico
testConnection();

