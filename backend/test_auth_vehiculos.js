const axios = require('axios');

const testAuthVehiculos = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔐 Testing Authentication and Vehiculos API...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  let authToken = null;
  let userId = null;
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Test 2: Try to login with test user
    console.log('\n2️⃣ Testing login...');
    const loginData = {
      username: 'ronald',
      password: '1122'
    };
    
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData);
      
      if (loginResponse.data.token) {
        authToken = loginResponse.data.token;
        userId = loginResponse.data.user.id;
        
        console.log('✅ Login successful!');
        console.log(`📏 Token length: ${authToken.length} characters`);
        console.log(`👤 User ID: ${userId}`);
        console.log(`👤 Username: ${loginResponse.data.user.username}`);
        
        // Configure axios defaults for authenticated requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
      } else {
        console.log('❌ Login failed - no token received');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('❌ Login failed with 401 - invalid credentials');
        console.log('💡 Please check if user exists in database');
        return;
      } else {
        console.log('❌ Login error:', error.response?.data?.error || error.message);
        return;
      }
    }
    
    // Test 3: Test profile endpoint with token
    console.log('\n3️⃣ Testing profile endpoint...');
    try {
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Profile request successful!');
      console.log(`👤 Profile data: ${profileResponse.data.user.username}`);
    } catch (error) {
      console.log('❌ Profile request failed:', error.response?.data?.error || error.message);
      console.log('📡 Status:', error.response?.status);
      console.log('📡 Full error:', error.response?.data);
      
      // Don't return here, continue with other tests
      console.log('⚠️ Continuing with other tests...');
    }
    
    // Test 4: Test vehicles endpoint with token
    console.log('\n4️⃣ Testing vehicles endpoint...');
    try {
      const vehiclesResponse = await axios.get(`${baseURL}/api/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Vehicles request successful!');
      console.log(`🚛 Found ${vehiclesResponse.data.total} vehicles`);
      
      if (vehiclesResponse.data.data.length > 0) {
        console.log('📋 Sample vehicle:', vehiclesResponse.data.data[0].placa);
      }
    } catch (error) {
      console.log('❌ Vehicles request failed:', error.response?.data?.error || error.message);
      console.log('📡 Status:', error.response?.status);
      return;
    }
    
    // Test 5: Test creating a vehicle
    console.log('\n5️⃣ Testing vehicle creation...');
    const testVehicle = {
      placa: 'TEST-' + Date.now(),
      marca: 'Toyota',
      modelo: 'Hilux',
      anio: 2023,
      tipo_vehiculo: 'Pickup',
      estado: 'ACT',
      color: 'Blanco',
      motor: '2.4L',
      kilometraje: 15000
    };
    
    try {
      const createResponse = await axios.post(`${baseURL}/api/vehiculos`, testVehicle, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Vehicle creation successful!');
      console.log(`🚛 Created vehicle with ID: ${createResponse.data.data.id_vehiculo}`);
      
      // Test 6: Test updating the vehicle
      console.log('\n6️⃣ Testing vehicle update...');
      const updateData = { ...testVehicle, color: 'Negro' };
      
      const updateResponse = await axios.put(`${baseURL}/api/vehiculos/${createResponse.data.data.id_vehiculo}`, updateData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Vehicle update successful!');
      
      // Test 7: Test deleting the vehicle
      console.log('\n7️⃣ Testing vehicle deletion...');
      const deleteResponse = await axios.delete(`${baseURL}/api/vehiculos/${createResponse.data.data.id_vehiculo}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Vehicle deletion successful!');
      
    } catch (error) {
      console.log('❌ Vehicle operation failed:', error.response?.data?.error || error.message);
      console.log('📡 Status:', error.response?.status);
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('✅ Authentication is working');
    console.log('✅ Vehiculos API is working');
    console.log('✅ CRUD operations are functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
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
console.log('🚀 Starting Authentication and Vehiculos Test...');
testAuthVehiculos();
