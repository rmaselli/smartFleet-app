const axios = require('axios');

async function testPhotoEndpointDetailed() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🔍 Probando endpoint de fotos en detalle...');
    
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
    
    // 2. Probar endpoint de fotos para autorización
    console.log('\n📋 Probando endpoint con hoja 89...');
    const fotosResponse = await axios.get(`${baseURL}/hoja-es/autorizacion/hoja/89/fotos`, { headers });
    
    console.log('📊 Respuesta completa del endpoint:');
    console.log(JSON.stringify(fotosResponse.data, null, 2));
    
    if (fotosResponse.data.data.fotos_motocicleta.length > 0) {
      const primeraFoto = fotosResponse.data.data.fotos_motocicleta[0];
      console.log('\n📸 Análisis detallado de la primera foto:');
      console.log(`  - ID: ${primeraFoto.id_foto}`);
      console.log(`  - Tipo: ${primeraFoto.tipo_foto}`);
      console.log(`  - Tiene foto_base64: ${!!primeraFoto.foto_base64}`);
      console.log(`  - Tipo de dato: ${typeof primeraFoto.foto_base64}`);
      console.log(`  - Longitud: ${primeraFoto.foto_base64 ? primeraFoto.foto_base64.length : 0}`);
      
      if (primeraFoto.foto_base64 && typeof primeraFoto.foto_base64 === 'string') {
        console.log(`  - Inicio: ${primeraFoto.foto_base64.substring(0, 100)}...`);
        console.log(`  - Es base64 válido: ${/^data:image\/[a-zA-Z]+;base64,/.test(primeraFoto.foto_base64)}`);
        
        // Probar si es una imagen válida
        try {
          const base64Data = primeraFoto.foto_base64.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          console.log(`  - Tamaño del buffer: ${buffer.length} bytes`);
          console.log(`  - Primeros bytes: ${buffer.slice(0, 10).toString('hex')}`);
        } catch (e) {
          console.log(`  - Error procesando base64: ${e.message}`);
        }
      }
    }
    
    console.log('\n✅ Análisis completado');
    
  } catch (error) {
    console.error('Error en la prueba:', error.response?.data || error.message);
  }
}

testPhotoEndpointDetailed();
