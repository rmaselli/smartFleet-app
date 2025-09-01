const axios = require('axios');

const testRegistrationAPI = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing Registration API...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Test health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test registration endpoint
    console.log('\n2️⃣ Testing registration endpoint...');
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpass123',
      full_name: 'Usuario de Prueba',
      phone: '+57 300 123 4567',
      department: 'Desarrollo',
      company_id: 1
    };
    
    console.log('📝 Test user data:', testUser);
    
    const registrationResponse = await axios.post(`${baseURL}/api/auth/register`, testUser);
    console.log('✅ Registration successful:', registrationResponse.data);
    
    // Test login with the created user
    console.log('\n3️⃣ Testing login with created user...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    console.log('\n🎉 All API tests passed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
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

// Run the test
testRegistrationAPI();
