const http = require('http');

const checkServerConfig = () => {
  console.log('🔍 Checking Server Configuration...');
  console.log('🎯 Verifying that server can handle large headers...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Test-Header-1': 'A'.repeat(100),   // 100 caracteres
      'X-Test-Header-2': 'B'.repeat(500),   // 500 caracteres
      'X-Test-Header-3': 'C'.repeat(1000),  // 1000 caracteres
      'X-Test-Header-4': 'D'.repeat(2000),  // 2000 caracteres
      'X-Test-Header-5': 'E'.repeat(5000),  // 5000 caracteres
      'User-Agent': 'ServerConfigChecker/1.0'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Response Status: ${res.statusCode}`);
    console.log(`📡 Response Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📡 Response Body: ${data}`);
      
      if (res.statusCode === 431) {
        console.error('❌ ERROR 431: Server cannot handle large headers');
        console.error('💡 Server configuration needs to be fixed');
      } else if (res.statusCode === 200) {
        console.log('✅ SUCCESS: Server handled large headers correctly');
        console.log('✅ No 431 error occurred');
      } else {
        console.log(`⚠️  Unexpected status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.error('💡 Make sure the server is running: cd backend && npm start');
  });

  req.on('timeout', () => {
    console.error('⏰ Request timed out');
    req.destroy();
  });

  req.setTimeout(10000); // 10 segundos
  req.end();
  
  console.log('📤 Sending test request with large headers...');
};

// Run check
checkServerConfig();
