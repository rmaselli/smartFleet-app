const axios = require('axios');

async function testAuthorizationPhotos() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando endpoint de fotos para autorización...');
    
    // 1. Login
    console.log('\n📋 Paso 1: Login...');
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
    console.log('\n📋 Paso 2: Probando endpoint de fotos para autorización...');
    try {
      const fotosResponse = await axios.get(`${baseURL}/hoja-es/autorizacion/hoja/87/fotos`, { headers });
      console.log('✅ Respuesta del endpoint:', {
        success: fotosResponse.data.success,
        total_motocicleta: fotosResponse.data.total.motocicleta,
        total_items: fotosResponse.data.total.items
      });
      
      // Verificar estructura de datos
      if (fotosResponse.data.data.fotos_motocicleta.length > 0) {
        const primeraFoto = fotosResponse.data.data.fotos_motocicleta[0];
        console.log('Primera foto de motocicleta:', {
          id_foto: primeraFoto.id_foto,
          tipo_foto: primeraFoto.tipo_foto,
          tiene_foto_base64: !!primeraFoto.foto_base64,
          foto_base64_length: primeraFoto.foto_base64 ? primeraFoto.foto_base64.length : 0
        });
      }
      
      if (fotosResponse.data.data.fotos_items.length > 0) {
        const primeraFotoItem = fotosResponse.data.data.fotos_items[0];
        console.log('Primera foto de item:', {
          id_foto_item: primeraFotoItem.id_foto_item,
          id_check: primeraFotoItem.id_check,
          desc_check: primeraFotoItem.desc_check,
          tiene_foto_base64: !!primeraFotoItem.foto_base64,
          foto_base64_length: primeraFotoItem.foto_base64 ? primeraFotoItem.foto_base64.length : 0
        });
      }
      
    } catch (error) {
      console.log('❌ Error obteniendo fotos para autorización:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Prueba completada');
    
  } catch (error) {
    console.error('Error en la prueba:', error.response?.data || error.message);
  }
}

testAuthorizationPhotos();
