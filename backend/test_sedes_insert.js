const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

// Datos de prueba para la sede
const testSede = {
  id_empresa: 1,
  cod_sede: 'Z001',
  cod_abreviado: 'LOC',
  desc_sede: 'Sede Central Guatemala',
  tipo_sede: 'LOC',
  observaciones: 'Sede principal de la empresa'
};

async function testSedesInsert() {
  try {
    console.log('🚀 Iniciando prueba de inserción de sedes...\n');

    // Paso 1: Login para obtener token
    console.log('1. Realizando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, TEST_USER);
    
    if (!loginResponse.data.success) {
      throw new Error('Error en login: ' + loginResponse.data.error);
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso\n');

    // Paso 2: Probar inserción de sede
    console.log('2. Probando inserción de sede...');
    console.log('Datos de la sede:', JSON.stringify(testSede, null, 2));
    
    const insertResponse = await axios.post(`${API_BASE_URL}/sedes`, testSede, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (insertResponse.data.success) {
      console.log('✅ Sede insertada exitosamente!');
      console.log('ID de la sede:', insertResponse.data.data.id_sede);
      console.log('Respuesta completa:', JSON.stringify(insertResponse.data, null, 2));
    } else {
      console.log('❌ Error en la inserción:', insertResponse.data.error);
    }

    // Paso 3: Verificar que la sede se insertó correctamente
    console.log('\n3. Verificando inserción...');
    const getResponse = await axios.get(`${API_BASE_URL}/sedes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (getResponse.data.success) {
      const sedes = getResponse.data.data;
      const nuevaSede = sedes.find(s => s.cod_sede === testSede.cod_sede);
      
      if (nuevaSede) {
        console.log('✅ Sede encontrada en la base de datos');
        console.log('Datos de la sede:', JSON.stringify(nuevaSede, null, 2));
      } else {
        console.log('❌ Sede no encontrada en la base de datos');
      }
    }

    // Paso 4: Probar inserción duplicada (debería fallar)
    console.log('\n4. Probando inserción duplicada (debería fallar)...');
    try {
      await axios.post(`${API_BASE_URL}/sedes`, testSede, {
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

    console.log('\n✅ Prueba de inserción de sedes completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar la prueba
testSedesInsert();
