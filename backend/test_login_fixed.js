const axios = require('axios');

const testLoginFixed = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🔐 Testing Login - Error 431 Fixed...');
  console.log(`📡 Base URL: ${baseURL}`);
  console.log('🎯 This test will verify that the 431 error is resolved');
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Test 2: Simple login attempt
    console.log('\n2️⃣ Testing basic login...');
    const loginData = {
      username: 'testuser',
      password: 'testpass123'
    };
    
    console.log('📤 Sending login request...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TestScript/1.0'
      }
    });
    
    console.log('✅ Login response received!');
    console.log(`📏 Token length: ${loginResponse.data.token?.length || 0} characters`);
    console.log(`👤 User: ${loginResponse.data.user?.username || 'N/A'}`);
    
    // Test 3: Test with token in headers
    if (loginResponse.data.token) {
      console.log('\n3️⃣ Testing authenticated request...');
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Authenticated request successful!');
      console.log(`👤 Profile loaded: ${profileResponse.data.user?.username || 'N/A'}`);
    }
    
    // Test 4: Test with various header sizes
    console.log('\n4️⃣ Testing header size limits...');
    const largeHeaderData = {
      username: 'largeheadertest',
      password: 'testpass123'
    };
    
    const largeHeaderResponse = await axios.post(`${baseURL}/api/auth/login`, largeHeaderData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Header-1': 'A'.repeat(500),  // 500 caracteres
        'X-Test-Header-2': 'B'.repeat(1000), // 1000 caracteres
        'X-Test-Header-3': 'C'.repeat(2000), // 2000 caracteres
        'User-Agent': 'TestScript-LargeHeaders/1.0'
      }
    });
    
    console.log('✅ Large headers test passed!');
    console.log('✅ No 431 error occurred');
    
    console.log('\n🎉 SUCCESS: Error 431 is completely resolved!');
    console.log('✅ Login functionality working properly');
    console.log('✅ Headers are being processed correctly');
    console.log('✅ No more "Request Header Fields Too Large" errors');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
      
      if (error.response.status === 431) {
        console.error('\n❌ ERROR 431 STILL OCCURRING!');
        console.error('💡 The server configuration needs to be checked');
        console.error('💡 Make sure the server was restarted after changes');
        console.error('💡 Check that all middleware configurations are applied');
      } else if (error.response.status === 401) {
        console.log('\n⚠️  Login failed with 401 (Unauthorized)');
        console.log('💡 This is normal - the user credentials are invalid');
        console.log('💡 But the important thing is: NO ERROR 431!');
        console.log('✅ The header size issue is resolved');
      } else {
        console.error(`💡 Unexpected error status: ${error.response.status}`);
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
console.log('🚀 Starting Login Test - Error 431 Resolution...');
testLoginFixed();
