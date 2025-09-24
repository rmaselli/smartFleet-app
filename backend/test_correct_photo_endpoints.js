const axios = require('axios');

async function testCorrectPhotoEndpoints() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test photo endpoint with correct ID
    const photoResponse = await axios.get('http://localhost:5000/api/hoja-es/foto/32', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ Photo endpoint working (ID 32)');
    console.log('Content-Type:', photoResponse.headers['content-type']);
    console.log('Content-Length:', photoResponse.data.length);
    
    // Test photo-item endpoint with correct ID
    const photoItemResponse = await axios.get('http://localhost:5000/api/hoja-es/foto-item/15', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ Photo-item endpoint working (ID 15)');
    console.log('Content-Type:', photoItemResponse.headers['content-type']);
    console.log('Content-Length:', photoItemResponse.data.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.status : error.message);
    if (error.response) {
      console.error('Response data:', error.response.data.toString());
    }
  }
}

testCorrectPhotoEndpoints();
