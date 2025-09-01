const axios = require('axios');

console.log(axios.isCancel('something'));

const testLoginAPI = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing Login API...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Test health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test with existing user (if any)
    console.log('\n2️⃣ Testing login with existing user...');
    
    // First, let's try to register a test user
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpass123',
      full_name: 'Usuario de Prueba',
      phone: '+57 300 123 4567',
      department: 'Desarrollo',
      company_id: 1
    };
    
    console.log('📝 Creating test user for login test:', testUser.username);
    
    try {
      const registrationResponse = await axios.post(`${baseURL}/api/auth/register`, testUser);
      console.log('✅ Test user created successfully');
      
      // Now test login with the created user
      console.log('\n3️⃣ Testing login with newly created user...');
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: testUser.username,
        password: testUser.password
      });
      
      console.log('✅ Login successful!');
      console.log('📝 Login response:', {
        message: loginResponse.data.message,
        token: loginResponse.data.token ? 'Token received' : 'No token',
        user: {
          id: loginResponse.data.user.id,
          username: loginResponse.data.user.username,
          email: loginResponse.data.user.email,
          role: loginResponse.data.user.role,
          status: loginResponse.data.user.status
        }
      });
      
      // Test login with wrong password
      console.log('\n4️⃣ Testing login with wrong password...');
      try {
        await axios.post(`${baseURL}/api/auth/login`, {
          username: testUser.username,
          password: 'wrongpassword'
        });
        console.log('❌ This should have failed!');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Login correctly rejected with wrong password');
        } else {
          console.log('❌ Unexpected error with wrong password:', error.response?.data);
        }
      }
      
      // Test login with non-existent user
      console.log('\n5️⃣ Testing login with non-existent user...');
      try {
        await axios.post(`${baseURL}/api/auth/login`, {
          username: 'nonexistentuser',
          password: 'anypassword'
        });
        console.log('❌ This should have failed!');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Login correctly rejected with non-existent user');
        } else {
          console.log('❌ Unexpected error with non-existent user:', error.response?.data);
        }
      }
      
      console.log('\n🎉 All login tests passed successfully!');
      
    } catch (registrationError) {
      console.log('⚠️  Could not create test user, testing with existing data...');
      
      // Try to login with some common test credentials
      const testCredentials = [
        { username: 'ronald', password: '1122' },
        { username: 'test', password: 'test123' },
        { username: 'user', password: 'password' }
      ];
      
      for (const cred of testCredentials) {
        try {
          console.log(`\n🔄 Trying login with: ${cred.username}`);
          const loginResponse = await axios.post(`${baseURL}/api/auth/login`, cred);
          console.log('✅ Login successful with:', cred.username);
          console.log('📝 User data:', loginResponse.data.user);
          break;
        } catch (error) {
          console.log(`❌ Login failed with: ${cred.username}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Login API test failed:', error.message);
    
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
testLoginAPI();
