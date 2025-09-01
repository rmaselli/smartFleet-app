const axios = require('axios');

const testAuthStepByStep = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔐 Testing Authentication Step by Step...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Step 1: Health check
    console.log('\n1️⃣ Step 1: Health check...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Step 2: Login
    console.log('\n2️⃣ Step 2: Login...');
    const loginData = {
      username: 'ronald',
      password: '1122'
    };
    
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData);
    console.log('✅ Login successful');
    console.log('📋 Response data:', {
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      tokenLength: loginResponse.data.token ? loginResponse.data.token.length : 0,
      user: loginResponse.data.user
    });
    
    if (!loginResponse.data.token) {
      console.log('❌ No token received from login');
      return;
    }
    
    const token = loginResponse.data.token;
    
    // Step 3: Decode token
    console.log('\n3️⃣ Step 3: Decode token...');
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(token);
      console.log('✅ Token decoded successfully');
      console.log('📋 Token payload:', {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.username,
        iat: decoded.iat,
        exp: decoded.exp
      });
    } catch (decodeError) {
      console.log('❌ Failed to decode token:', decodeError.message);
      return;
    }
    
    // Step 4: Test profile endpoint
    console.log('\n4️⃣ Step 4: Test profile endpoint...');
    console.log('🔍 Sending request with token...');
    
    try {
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Profile request successful!');
      console.log('📋 Profile data:', profileResponse.data);
      
    } catch (error) {
      console.log('❌ Profile request failed');
      console.log('📡 Error status:', error.response?.status);
      console.log('📡 Error message:', error.response?.data?.error || error.message);
      console.log('📡 Full error:', error.message);
      
      if (error.response?.status === 401) {
        console.log('🔍 401 Unauthorized - Token authentication failed');
      } else if (error.response?.status === 500) {
        console.log('🔍 500 Server Error - Backend error occurred');
      }
    }
    
    console.log('\n🎉 Authentication test completed!');
    
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
console.log('🚀 Starting Step-by-Step Authentication Test...');
testAuthStepByStep();
