const axios = require('axios');

async function testPhotoEndpoints() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Probando endpoints de fotos...');
    
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
    
    // 2. Obtener fotos de una hoja existente
    console.log('\n📋 Paso 2: Obteniendo fotos de hoja 87...');
    try {
      const fotosResponse = await axios.get(`${baseURL}/hoja-es/hoja/87/fotos`, { headers });
      console.log('✅ Fotos de motocicleta obtenidas:', fotosResponse.data.total);
      
      if (fotosResponse.data.data.length > 0) {
        const primeraFoto = fotosResponse.data.data[0];
        console.log('Primera foto:', {
          id_foto: primeraFoto.id_foto,
          tipo_foto: primeraFoto.tipo_foto,
          nombre_archivo: primeraFoto.nombre_archivo,
          tipo_mime: primeraFoto.tipo_mime
        });
        
        // 3. Probar endpoint individual de foto
        console.log('\n📋 Paso 3: Probando endpoint individual de foto...');
        try {
          const fotoIndividualResponse = await axios.get(`${baseURL}/hoja-es/foto/${primeraFoto.id_foto}`, { 
            headers: {
              'Authorization': `Bearer ${token}`
            },
            responseType: 'arraybuffer' // Importante para datos binarios
          });
          console.log('✅ Foto individual obtenida:', {
            status: fotoIndividualResponse.status,
            contentType: fotoIndividualResponse.headers['content-type'],
            size: fotoIndividualResponse.data.length
          });
        } catch (error) {
          console.log('❌ Error obteniendo foto individual:', error.response?.status, error.response?.data);
        }
      }
    } catch (error) {
      console.log('❌ Error obteniendo fotos de hoja:', error.response?.data || error.message);
    }
    
    // 4. Probar fotos de items
    console.log('\n📋 Paso 4: Probando fotos de items...');
    try {
      const fotosItemsResponse = await axios.get(`${baseURL}/hoja-es/hoja/87/fotos-items`, { headers });
      console.log('✅ Fotos de items obtenidas:', fotosItemsResponse.data.total);
      
      if (fotosItemsResponse.data.data.length > 0) {
        const primeraFotoItem = fotosItemsResponse.data.data[0];
        console.log('Primera foto de item:', {
          id_foto_item: primeraFotoItem.id_foto_item,
          id_check: primeraFotoItem.id_check,
          desc_check: primeraFotoItem.desc_check,
          nombre_archivo: primeraFotoItem.nombre_archivo
        });
        
        // 5. Probar endpoint individual de foto de item
        console.log('\n📋 Paso 5: Probando endpoint individual de foto de item...');
        try {
          const fotoItemResponse = await axios.get(`${baseURL}/hoja-es/foto-item/${primeraFotoItem.id_foto_item}`, { 
            headers: {
              'Authorization': `Bearer ${token}`
            },
            responseType: 'arraybuffer'
          });
          console.log('✅ Foto de item obtenida:', {
            status: fotoItemResponse.status,
            contentType: fotoItemResponse.headers['content-type'],
            size: fotoItemResponse.data.length
          });
        } catch (error) {
          console.log('❌ Error obteniendo foto de item:', error.response?.status, error.response?.data);
        }
      }
    } catch (error) {
      console.log('❌ Error obteniendo fotos de items:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Prueba de endpoints completada');
    
  } catch (error) {
    console.error('Error en la prueba:', error.response?.data || error.message);
  }
}

testPhotoEndpoints();
