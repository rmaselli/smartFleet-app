const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

// Datos de prueba para el piloto
const testPiloto = {
  id_empresa: 1,
  id_sede: 1,
  nombres: 'Juan Carlos',
  apellidos: 'Pérez García',
  fe_nacimiento: '1985-05-15',
  direccion: 'Zona 10, Ciudad de Guatemala',
  telefono: '5555-1234',
  num_dpi: '1234567890123',
  fe_vence_dpi: '2025-12-31',
  num_licencia: 'LIC-2024-001',
  fe_vence_licencia: '2025-06-30',
  estado: 'Activo',
  observaciones: 'Piloto de prueba'
};

async function testPilotosInsert() {
  try {
    console.log('🚀 Iniciando prueba de inserción de pilotos...\n');

    // Paso 1: Login para obtener token
    console.log('1. Realizando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, TEST_USER);
    
    if (!loginResponse.data.success) {
      throw new Error('Error en login: ' + loginResponse.data.error);
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso\n');

    // Paso 2: Probar inserción de piloto
    console.log('2. Probando inserción de piloto...');
    console.log('Datos del piloto:', JSON.stringify(testPiloto, null, 2));
    
    const insertResponse = await axios.post(`${API_BASE_URL}/pilotos`, testPiloto, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (insertResponse.data.success) {
      console.log('✅ Piloto insertado exitosamente!');
      console.log('ID del piloto:', insertResponse.data.data.id_piloto);
      console.log('Respuesta completa:', JSON.stringify(insertResponse.data, null, 2));
    } else {
      console.log('❌ Error en la inserción:', insertResponse.data.error);
    }

    // Paso 3: Verificar que el piloto se insertó correctamente
    console.log('\n3. Verificando inserción...');
    const getResponse = await axios.get(`${API_BASE_URL}/pilotos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (getResponse.data.success) {
      const pilotos = getResponse.data.data;
      const nuevoPiloto = pilotos.find(p => p.num_dpi === testPiloto.num_dpi);
      
      if (nuevoPiloto) {
        console.log('✅ Piloto encontrado en la base de datos');
        console.log('Datos del piloto:', JSON.stringify(nuevoPiloto, null, 2));
      } else {
        console.log('❌ Piloto no encontrado en la base de datos');
      }
    }

    // Paso 4: Probar inserción duplicada (debería fallar)
    console.log('\n4. Probando inserción duplicada (debería fallar)...');
    try {
      await axios.post(`${API_BASE_URL}/pilotos`, testPiloto, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ ERROR: Se permitió inserción duplicada');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctamente rechazó inserción duplicada');
        console.log('Mensaje:', error.response.data.error);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar la prueba
testPilotosInsert();
