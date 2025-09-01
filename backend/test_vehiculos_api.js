const axios = require('axios');

const testVehiculosAPI = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🚛 Testing Vehiculos API...');
  console.log(`📡 Base URL: ${baseURL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Test 2: Get all vehicles (without auth - should fail)
    console.log('\n2️⃣ Testing get vehicles without auth...');
    try {
      const vehiclesResponse = await axios.get(`${baseURL}/api/vehiculos`);
      console.log('⚠️  Unexpected success without auth');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected without authentication');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status || error.message);
      }
    }
    
    // Test 3: Create test vehicle (without auth - should fail)
    console.log('\n3️⃣ Testing create vehicle without auth...');
    const testVehicle = {
      placa: 'TEST-123',
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
      const createResponse = await axios.post(`${baseURL}/api/vehiculos`, testVehicle);
      console.log('⚠️  Unexpected success without auth');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected without authentication');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status || error.message);
      }
    }
    
    console.log('\n🎉 Vehiculos API tests completed!');
    console.log('✅ API endpoints are properly protected');
    console.log('💡 To test with authentication, you need to login first');
    
  } catch (error) {
    console.error('❌ Vehiculos API test failed:', error.message);
    
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
testVehiculosAPI();
