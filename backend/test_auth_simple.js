const axios = require('axios');

const testAuthSimple = async () => {
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
      console.log(`👤 User data:`, loginResponse.data.user);
      
      // Test 3: Test profile endpoint with token
      console.log('\n3️⃣ Testing profile endpoint...');
      
      try {
        const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Profile request successful!');
        console.log(`👤 Profile data:`, profileResponse.data);
        
      } catch (error) {
        console.log('❌ Profile request failed:');
        console.log('📡 Status:', error.response?.status);
        console.log('📡 Error:', error.response?.data?.error || error.message);
        
        // Try to decode the token to see what's in it
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.decode(token);
          console.log('🔍 Token decoded:', decoded);
        } catch (decodeError) {
          console.log('🔍 Could not decode token:', decodeError.message);
        }
      }
      
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
console.log('🚀 Starting Simple Auth Test...');
testAuthSimple();
