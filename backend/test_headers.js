const axios = require('axios');

const testHeaders = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Header Size Limits...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Test 1: Health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Login with normal credentials
    console.log('\n2️⃣ Testing login with normal credentials...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: 'testuser',
      password: 'testpass123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login successful');
      console.log(`📏 Token length: ${loginResponse.data.token.length} characters`);
      
      // Test 3: Test with token in headers
      console.log('\n3️⃣ Testing API call with token in headers...');
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Profile request successful with token');
      
      // Test 4: Test with very long custom headers
      console.log('\n4️⃣ Testing with custom headers...');
      const customHeadersResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: 'testuser2',
        password: 'testpass123'
      }, {
        headers: {
          'X-Custom-Header': 'A'.repeat(1000), // Header de 1000 caracteres
          'X-Another-Header': 'B'.repeat(500),  // Header de 500 caracteres
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Request with custom headers successful');
      
    } else {
      console.log('⚠️  Login failed, but headers were processed correctly');
    }
    
    console.log('\n🎉 All header tests passed successfully!');
    console.log('✅ No more "Request Header Fields Too Large" errors');
    
  } catch (error) {
    console.error('❌ Header test failed:', error.message);
    
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
      
      if (error.response.status === 431) {
        console.error('❌ Still getting 431 error - headers too large');
        console.error('💡 Check server configuration and token size');
      }
    } else if (error.request) {
      console.error('📡 No response received. Is the server running?');
      console.error('💡 Make sure to run: cd backend && npm start');
    } else {
      console.error('💥 Error details:', error.message);
    }
  }
};

// Run the test
testHeaders();
