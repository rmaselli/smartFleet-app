const axios = require('axios');

const testBackend = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing backend endpoints directly...');
  console.log(`📡 Base URL: ${baseURL}`);

  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing health check endpoint...');
    try {
      const healthResponse = await axios.get(`${baseURL}/api/health`);
      console.log('✅ Health check successful');
      console.log('   Status:', healthResponse.status);
      console.log('   Data:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Backend is not running. Start it with: npm run dev');
        return;
      }
    }

    // Test 2: Test login endpoint with valid credentials
    console.log('\n2️⃣ Testing login endpoint with valid credentials...');
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: 'ronald',
        password: '1122'
      });
      
      console.log('✅ Login successful');
      console.log('   Status:', loginResponse.status);
      console.log('   Has Token:', !!loginResponse.data.token);
      console.log('   Has User:', !!loginResponse.data.user);
      console.log('   Message:', loginResponse.data.message);
      
      if (loginResponse.data.token) {
        console.log('   Token Length:', loginResponse.data.token.length);
        console.log('   Token Preview:', loginResponse.data.token.substring(0, 50) + '...');
      } else {
        console.log('⚠️  No token in response!');
        console.log('   Full response:', JSON.stringify(loginResponse.data, null, 2));
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      }
    }

    // Test 3: Test login endpoint with invalid credentials
    console.log('\n3️⃣ Testing login endpoint with invalid credentials...');
    try {
      const invalidLoginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: 'invalid',
        password: 'invalid'
      });
      
      console.log('⚠️  Invalid login should have failed but succeeded');
      console.log('   Status:', invalidLoginResponse.status);
      console.log('   Data:', invalidLoginResponse.data);
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login correctly rejected');
        console.log('   Status:', error.response.status);
        console.log('   Error:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error with invalid credentials:', error.message);
      }
    }

    // Test 4: Test login endpoint with empty credentials
    console.log('\n4️⃣ Testing login endpoint with empty credentials...');
    try {
      const emptyLoginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: '',
        password: ''
      });
      
      console.log('⚠️  Empty credentials should have failed but succeeded');
      console.log('   Status:', emptyLoginResponse.status);
      console.log('   Data:', emptyLoginResponse.data);
      
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Empty credentials correctly rejected');
        console.log('   Status:', error.response.status);
        console.log('   Errors:', error.response.data.errors);
      } else {
        console.log('❌ Unexpected error with empty credentials:', error.message);
      }
    }

    // Test 5: Test CORS
    console.log('\n5️⃣ Testing CORS...');
    try {
      const corsResponse = await axios.options(`${baseURL}/api/auth/login`);
      console.log('✅ CORS preflight successful');
      console.log('   Status:', corsResponse.status);
      console.log('   CORS Headers:', {
        'Access-Control-Allow-Origin': corsResponse.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': corsResponse.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': corsResponse.headers['access-control-allow-headers']
      });
    } catch (error) {
      console.log('❌ CORS test failed:', error.message);
    }

    console.log('\n✅ Backend testing completed');
    
  } catch (error) {
    console.error('❌ Backend testing failed:', error.message);
  }
};

// Run the test
testBackend();
