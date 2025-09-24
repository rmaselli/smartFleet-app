const axios = require('axios');

async function testPhotoEndpoints() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test photo endpoint
    const photoResponse = await axios.get('http://localhost:5000/api/hoja-es/foto/23', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ Photo endpoint working');
    console.log('Content-Type:', photoResponse.headers['content-type']);
    console.log('Content-Length:', photoResponse.data.length);
    
    // Test photo-item endpoint
    const photoItemResponse = await axios.get('http://localhost:5000/api/hoja-es/foto-item/1', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ Photo-item endpoint working');
    console.log('Content-Type:', photoItemResponse.headers['content-type']);
    console.log('Content-Length:', photoItemResponse.data.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.status : error.message);
    if (error.response) {
      console.error('Response data:', error.response.data.toString());
    }
  }
}

testPhotoEndpoints();
