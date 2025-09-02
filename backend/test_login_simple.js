const http = require('http');

const testLoginSimple = () => {
  console.log('🧪 Testing login with simple HTTP request (no axios)...');
  console.log('📡 Testing: http://localhost:3000/api/auth/login');

  // Create simple HTTP request
  const postData = JSON.stringify({
    username: 'ronald',
    password: '1122'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
      // Solo headers esenciales para evitar 431
    }
  };

  const req = http.request(options, (res) => {
    console.log('✅ Response received');
    console.log('   Status:', res.statusCode);
    console.log('   Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const responseData = JSON.parse(data);
        console.log('   Response Data:');
        console.log('     - hasToken:', !!responseData.token);
        console.log('     - hasUser:', !!responseData.user);
        console.log('     - hasMessage:', !!responseData.message);
        
        if (responseData.token) {
          console.log('     - Token Length:', responseData.token.length);
          console.log('     - Token Preview:', responseData.token.substring(0, 50) + '...');
          
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
          console.log('     - Status:', responseData.user.status);
        }
        
        console.log('     - Message:', responseData.message);
        
      } catch (error) {
        console.log('   ❌ Failed to parse response:', error.message);
        console.log('   Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });

  req.write(postData);
  req.end();
};

// Test health endpoint first
const testHealth = () => {
  console.log('\n🏥 Testing health endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log('   Health Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const healthData = JSON.parse(data);
        console.log('   Health Data:', healthData);
      } catch (error) {
        console.log('   Health parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('   Health check failed:', error.message);
  });

  req.end();
};

// Run tests
console.log('🚀 Starting simple HTTP tests...\n');

// Test health first
testHealth();

// Wait a bit then test login
setTimeout(() => {
  testLoginSimple();
}, 1000);



