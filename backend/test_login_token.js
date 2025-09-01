const axios = require('axios');

const testLoginToken = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing login endpoint for token generation...');
  console.log(`📡 Base URL: ${baseURL}`);

  // Test credentials - use correct field names
  const testCredentials = [
    { username: 'ronald', password: '1122' },
    { username: 'otro', password: 'otro' },
    { username: 'admin', password: 'admin123' }
  ];

  for (const cred of testCredentials) {
    console.log(`\n🔑 Testing with credentials: ${cred.username} / ${cred.password}`);
    
    try {
      // Test login endpoint
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, cred);
      
      console.log('✅ Login successful');
      console.log('   Status:', loginResponse.status);
      console.log('   Response Headers:', loginResponse.headers);
      
      // Check response structure
      const responseData = loginResponse.data;
      console.log('   Response Data:');
      console.log('     - hasToken:', !!responseData.token);
      console.log('     - hasUser:', !!responseData.user);
      console.log('     - hasMessage:', !!responseData.message);
      
      if (responseData.token) {
        console.log('     - Token Length:', responseData.token.length);
        console.log('     - Token Type:', typeof responseData.token);
        console.log('     - Token Preview:', responseData.token.substring(0, 50) + '...');
        
        // Verify token structure (basic JWT check)
        if (responseData.token.split('.').length === 3) {
          console.log('     - Token Format: ✅ Valid JWT format');
        } else {
          console.log('     - Token Format: ❌ Invalid JWT format');
        }
      } else {
        console.log('     - Token: ❌ MISSING TOKEN!');
        console.log('     - Full Response:', JSON.stringify(responseData, null, 2));
      }
      
      if (responseData.user) {
        console.log('     - User ID:', responseData.user.id);
        console.log('     - Username:', responseData.user.username);
        console.log('     - Email:', responseData.user.email);
        console.log('     - Status:', responseData.user.status);
      } else {
        console.log('     - User: ❌ MISSING USER DATA!');
      }
      
      console.log('     - Message:', responseData.message);
      
      // Test if response is valid JSON
      try {
        const jsonTest = JSON.stringify(responseData);
        console.log('   JSON Serialization: ✅ Valid');
        console.log('   Response Size:', jsonTest.length, 'characters');
      } catch (error) {
        console.log('   JSON Serialization: ❌ Failed -', error.message);
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      
      if (error.response) {
        console.log('   Response Status:', error.response.status);
        console.log('   Response Data:', error.response.data);
        console.log('   Response Headers:', error.response.headers);
      } else if (error.request) {
        console.log('   No response received');
        console.log('   Request:', error.request);
      } else {
        console.log('   Error setting up request:', error.message);
      }
    }
  }

  // Test with invalid credentials
  console.log('\n❌ Testing with invalid credentials...');
  try {
    const invalidResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: 'invalid',
      password: 'invalid'
    });
    
    console.log('⚠️  Invalid login should have failed but succeeded');
    console.log('   Status:', invalidResponse.status);
    console.log('   Data:', invalidResponse.data);
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid login correctly rejected');
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error with invalid credentials:', error.message);
    }
  }

  // Test CORS
  console.log('\n🌐 Testing CORS...');
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

  console.log('\n✅ Login token testing completed');
};

// Run the test
testLoginToken();
