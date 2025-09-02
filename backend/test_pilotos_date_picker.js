const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

// Datos de prueba para el piloto con fechas válidas
const testPiloto = {
  id_empresa: 1,
  id_sede: 1,
  nombres: 'María Elena',
  apellidos: 'González López',
  fe_nacimiento: '1990-03-15', // Fecha de nacimiento válida (pasada)
  direccion: 'Zona 15, Ciudad de Guatemala',
  telefono: '5555-5678',
  num_dpi: '9876543210987',
  fe_vence_dpi: '2026-12-31', // Fecha de vencimiento futura
  num_licencia: 'LIC-2024-002',
  fe_vence_licencia: '2026-06-30', // Fecha de vencimiento futura
  estado: 'Activo',
  observaciones: 'Piloto de prueba con date picker'
};

async function testPilotosDatePicker() {
  try {
    console.log('🚀 Iniciando prueba de date picker en pilotos...\n');

    // Paso 1: Login para obtener token
    console.log('1. Realizando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, TEST_USER);
    
    if (!loginResponse.data.success) {
      throw new Error('Error en login: ' + loginResponse.data.error);
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso\n');

    // Paso 2: Probar inserción de piloto con fechas
    console.log('2. Probando inserción de piloto con date picker...');
    console.log('Datos del piloto:');
    console.log('  - Fecha de nacimiento:', testPiloto.fe_nacimiento);
    console.log('  - Vencimiento DPI:', testPiloto.fe_vence_dpi);
    console.log('  - Vencimiento Licencia:', testPiloto.fe_vence_licencia);
    
    const insertResponse = await axios.post(`${API_BASE_URL}/pilotos`, testPiloto, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (insertResponse.data.success) {
      console.log('✅ Piloto insertado exitosamente con date picker!');
      console.log('ID del piloto:', insertResponse.data.data.id_piloto);
      console.log('Fechas guardadas:');
      console.log('  - Fecha de nacimiento:', insertResponse.data.data.fe_nacimiento);
      console.log('  - Vencimiento DPI:', insertResponse.data.data.fe_vence_dpi);
      console.log('  - Vencimiento Licencia:', insertResponse.data.data.fe_vence_licencia);
    } else {
      console.log('❌ Error en la inserción:', insertResponse.data.error);
    }

    // Paso 3: Probar validación de fechas inválidas
    console.log('\n3. Probando validación de fechas inválidas...');
    
    const invalidPiloto = {
      ...testPiloto,
      num_dpi: '1111111111111', // DPI diferente para evitar duplicado
      fe_nacimiento: '2030-01-01', // Fecha futura (inválida)
      fe_vence_dpi: '2020-01-01'   // Fecha pasada (inválida)
    };

    try {
      await axios.post(`${API_BASE_URL}/pilotos`, invalidPiloto, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ ERROR: Se permitió inserción con fechas inválidas');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctamente rechazó fechas inválidas');
        console.log('Mensaje:', error.response.data.error);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

    // Paso 4: Verificar que el piloto se insertó correctamente
    console.log('\n4. Verificando inserción...');
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
        console.log('Fechas verificadas:');
        console.log('  - Fecha de nacimiento:', nuevoPiloto.fe_nacimiento);
        console.log('  - Vencimiento DPI:', nuevoPiloto.fe_vence_dpi);
        console.log('  - Vencimiento Licencia:', nuevoPiloto.fe_vence_licencia);
      } else {
        console.log('❌ Piloto no encontrado en la base de datos');
      }
    }

    console.log('\n✅ Prueba de date picker completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Ejecutar la prueba
testPilotosDatePicker();
