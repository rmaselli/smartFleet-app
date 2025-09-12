const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Función para probar las APIs de HojaES
async function testHojaES() {
  try {
    console.log('🧪 Iniciando pruebas de HojaES...\n');

    // 1. Probar obtener items de checklist
    console.log('1. Probando obtener items de checklist...');
    try {
      const itemsResponse = await axios.get(`${API_BASE_URL}/hoja-es/items`);
      console.log('✅ Items obtenidos:', itemsResponse.data.data?.length || 0);
      if (itemsResponse.data.data && itemsResponse.data.data.length > 0) {
        console.log('📋 Primeros items:');
        itemsResponse.data.data.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. ID: ${item.id_check}, Descripción: ${item.descripcion_check || item.nombre_check || 'Sin descripción'}`);
        });
      }
    } catch (error) {
      console.log('❌ Error obteniendo items:', error.response?.data?.error || error.message);
    }

    // 2. Probar obtener pilotos
    console.log('\n2. Probando obtener pilotos...');
    try {
      const pilotosResponse = await axios.get(`${API_BASE_URL}/hoja-es/pilotos`);
      console.log('✅ Pilotos obtenidos:', pilotosResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error obteniendo pilotos:', error.response?.data?.error || error.message);
    }

    // 3. Probar obtener vehículos
    console.log('\n3. Probando obtener vehículos...');
    try {
      const vehiculosResponse = await axios.get(`${API_BASE_URL}/hoja-es/vehiculos`);
      console.log('✅ Vehículos obtenidos:', vehiculosResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error obteniendo vehículos:', error.response?.data?.error || error.message);
    }

    // 4. Probar obtener hojas existentes
    console.log('\n4. Probando obtener hojas existentes...');
    try {
      const hojasResponse = await axios.get(`${API_BASE_URL}/hoja-es/hojas`);
      console.log('✅ Hojas obtenidas:', hojasResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error obteniendo hojas:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📋 Para probar la funcionalidad completa:');
    console.log('1. Inicia el backend: npm start (en la carpeta backend)');
    console.log('2. Inicia el frontend: npm start (en la carpeta frontend)');
    console.log('3. Navega a: http://localhost:3001/operaciones/salidas/hoja-es');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar pruebas
testHojaES();
