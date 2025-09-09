const axios = require('axios');

const testSimpleAuth = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔐 Testing Simple Authentication...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Test 2: Try to login
    console.log('\n2️⃣ Testing login...');
    const loginData = {
      username: 'ronald',
      password: '1122'
    };
    
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData);
    console.log('✅ Login response:', loginResponse.data);
    
    if (loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log(`📏 Token length: ${token.length}`);
      
      // Test 3: Test vehicles endpoint with token
      console.log('\n3️⃣ Testing vehicles endpoint with token...');
      const vehiclesResponse = await axios.get(`${baseURL}/api/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Vehicles response:', vehiclesResponse.data);
      
    } else {
      console.log('❌ No token received');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📡 No response received. Is the server running?');
    } else {
      console.error('💥 Error details:', error.message);
    }
  }
};

// Run the test
testSimpleAuth();






