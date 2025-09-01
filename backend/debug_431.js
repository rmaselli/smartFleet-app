const axios = require('axios');

const debug431 = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🔍 Debugging Error 431 - Request Header Fields Too Large');
  console.log(`📡 Base URL: ${baseURL}`);
  console.log('🎯 Step-by-step diagnosis...');
  
  try {
    // Test 1: Basic health check
    console.log('\n1️⃣ Testing basic server health...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server health:', healthResponse.data.status);
    
    // Test 2: Minimal login request
    console.log('\n2️⃣ Testing minimal login request...');
    const minimalLogin = {
      username: 'test',
      password: 'test'
    };
    
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, minimalLogin);
      console.log('✅ Minimal login successful (unexpected!)');
      console.log('Token length:', loginResponse.data.token?.length || 0);
    } catch (error) {
      if (error.response && error.response.status === 431) {
        console.error('❌ ERROR 431 with minimal request!');
        console.error('This means the server configuration is still wrong');
        console.error('Response data:', error.response.data);
        return;
      } else if (error.response && error.response.status === 401) {
        console.log('✅ Minimal login failed with 401 (expected)');
        console.log('✅ No 431 error with minimal request');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status || error.message);
      }
    }
    
    // Test 3: Test with slightly larger headers
    console.log('\n3️⃣ Testing with slightly larger headers...');
    const smallHeaders = {
      username: 'test2',
      password: 'test2'
    };
    
    try {
      const smallResponse = await axios.post(`${baseURL}/api/auth/login`, smallHeaders, {
        headers: {
          'Content-Type': 'application/json',
          'X-Small-Header': 'A'.repeat(100) // Solo 100 caracteres
        }
      });
      console.log('✅ Small headers test passed');
    } catch (error) {
      if (error.response && error.response.status === 431) {
        console.error('❌ ERROR 431 with small headers!');
        console.error('Server cannot handle even small headers');
        return;
      } else if (error.response && error.response.status === 401) {
        console.log('✅ Small headers test passed (401 expected)');
      }
    }
    
    // Test 4: Test with medium headers
    console.log('\n4️⃣ Testing with medium headers...');
    const mediumHeaders = {
      username: 'test3',
      password: 'test3'
    };
    
    try {
      const mediumResponse = await axios.post(`${baseURL}/api/auth/login`, mediumHeaders, {
        headers: {
          'Content-Type': 'application/json',
          'X-Medium-Header': 'B'.repeat(500) // 500 caracteres
        }
      });
      console.log('✅ Medium headers test passed');
    } catch (error) {
      if (error.response && error.response.status === 431) {
        console.error('❌ ERROR 431 with medium headers!');
        console.error('Server cannot handle medium headers');
        return;
      } else if (error.response && error.response.status === 401) {
        console.log('✅ Medium headers test passed (401 expected)');
      }
    }
    
    // Test 5: Test with large headers
    console.log('\n5️⃣ Testing with large headers...');
    const largeHeaders = {
      username: 'test4',
      password: 'test4'
    };
    
    try {
      const largeResponse = await axios.post(`${baseURL}/api/auth/login`, largeHeaders, {
        headers: {
          'Content-Type': 'application/json',
          'X-Large-Header': 'C'.repeat(1000) // 1000 caracteres
        }
      });
      console.log('✅ Large headers test passed');
    } catch (error) {
      if (error.response && error.response.status === 431) {
        console.error('❌ ERROR 431 with large headers!');
        console.error('Server cannot handle large headers');
        return;
      } else if (error.response && error.response.status === 401) {
        console.log('✅ Large headers test passed (401 expected)');
      }
    }
    
    console.log('\n🎉 SUCCESS: No 431 errors detected!');
    console.log('✅ Server is handling headers correctly');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📡 No response received. Is the server running?');
      console.error('💡 Make sure to run: cd backend && npm start');
    } else {
      console.error('💥 Error details:', error.message);
    }
  }
};

// Run debug
console.log('🚀 Starting 431 Error Debug...');
debug431();
