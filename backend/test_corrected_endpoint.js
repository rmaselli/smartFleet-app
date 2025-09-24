const axios = require('axios');

async function testCorrectedEndpoint() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando endpoint corregido...');
    
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
    
    // 2. Probar endpoint de fotos para autorización con hoja 89
    console.log('\n📋 Probando endpoint con hoja 89...');
    const fotosResponse = await axios.get(`${baseURL}/hoja-es/autorizacion/hoja/89/fotos`, { headers });
    console.log('✅ Respuesta del endpoint:', {
      success: fotosResponse.data.success,
      total_motocicleta: fotosResponse.data.total.motocicleta,
      total_items: fotosResponse.data.total.items
    });
    
    if (fotosResponse.data.data.fotos_motocicleta.length > 0) {
      const primeraFoto = fotosResponse.data.data.fotos_motocicleta[0];
      console.log('\n📸 Primera foto de motocicleta:');
      console.log(`  - ID: ${primeraFoto.id_foto}`);
      console.log(`  - Tipo: ${primeraFoto.tipo_foto}`);
      console.log(`  - Tiene foto_base64: ${!!primeraFoto.foto_base64}`);
      console.log(`  - Tipo de dato: ${typeof primeraFoto.foto_base64}`);
      console.log(`  - Es Buffer: ${Buffer.isBuffer(primeraFoto.foto_base64)}`);
      console.log(`  - Longitud: ${primeraFoto.foto_base64 ? primeraFoto.foto_base64.length : 0}`);
      if (typeof primeraFoto.foto_base64 === 'string') {
        console.log(`  - Inicio: ${primeraFoto.foto_base64.substring(0, 50) + '...'}`);
        console.log(`  - Es base64 válido: ${/^data:image\/[a-zA-Z]+;base64,/.test(primeraFoto.foto_base64)}`);
      } else if (Buffer.isBuffer(primeraFoto.foto_base64)) {
        console.log(`  - Buffer preview: ${primeraFoto.foto_base64.toString('utf8', 0, 50)}...`);
      }
    }
    
    console.log('\n✅ Prueba completada');
    
  } catch (error) {
    console.error('Error en la prueba:', error.response?.data || error.message);
  }
}

testCorrectedEndpoint();
