const axios = require('axios');

async function checkPhotosForHoja() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Get photos for hoja 91
    const photosResponse = await axios.get('http://localhost:5000/api/hoja-es/autorizacion/hoja/91/fotos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📸 Fotos de motocicleta:');
    photosResponse.data.data.fotos_motocicleta.forEach((foto, index) => {
      console.log(`${index + 1}. ID: ${foto.id_foto}, Tipo: ${foto.tipo_foto}`);
    });
    
    console.log('📸 Fotos de items:');
    photosResponse.data.data.fotos_items.forEach((foto, index) => {
      console.log(`${index + 1}. ID: ${foto.id_foto_item}, Check: ${foto.desc_check}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.status : error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

checkPhotosForHoja();
