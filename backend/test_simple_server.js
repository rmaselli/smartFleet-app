const http = require('http');

const testSimpleServer = () => {
  console.log('🧪 Probando servidor simple...\n');

  // Test 1: Health endpoint
  const testHealth = () => {
    return new Promise((resolve) => {
      console.log('🏥 Probando /api/health...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`   Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            try {
              const healthData = JSON.parse(data);
              console.log('   ✅ Health endpoint funciona');
              console.log('   Data:', healthData);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing JSON:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ Health endpoint falló');
            console.log('   Response:', data.substring(0, 100));
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error:', error.message);
        resolve(false);
      });

      req.end();
    });
  };

  // Test 2: Root endpoint
  const testRoot = () => {
    return new Promise((resolve) => {
      console.log('\n🌐 Probando /...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`   Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            try {
              const rootData = JSON.parse(data);
              console.log('   ✅ Root endpoint funciona');
              console.log('   Data:', rootData);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing JSON:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ Root endpoint falló');
            console.log('   Response:', data.substring(0, 100));
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error:', error.message);
        resolve(false);
      });

      req.end();
    });
  };

  // Test 3: Test endpoint
  const testTest = () => {
    return new Promise((resolve) => {
      console.log('\n🧪 Probando /test...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/test',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`   Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            try {
              const testData = JSON.parse(data);
              console.log('   ✅ Test endpoint funciona');
              console.log('   Data:', testData);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing JSON:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ Test endpoint falló');
            console.log('   Response:', data.substring(0, 100));
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error:', error.message);
        resolve(false);
      });

      req.end();
    });
  };

  // Test 4: Invalid endpoint
  const testInvalid = () => {
    return new Promise((resolve) => {
      console.log('\n❌ Probando endpoint inválido /invalid...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/invalid',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log(`   Status: ${res.statusCode}`);
          if (res.statusCode === 404) {
            try {
              const errorData = JSON.parse(data);
              console.log('   ✅ 404 handler funciona correctamente');
              console.log('   Error:', errorData);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing 404 response:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ 404 handler no funciona como esperado');
            console.log('   Response:', data.substring(0, 100));
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error:', error.message);
        resolve(false);
      });

      req.end();
    });
  };

  // Run all tests
  const runTests = async () => {
    console.log('🚀 Iniciando pruebas del servidor simple...\n');

    const healthResult = await testHealth();
    const rootResult = await testRoot();
    const testResult = await testTest();
    const invalidResult = await testInvalid();

    // Summary
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('========================');
    console.log(`Health endpoint: ${healthResult ? '✅' : '❌'}`);
    console.log(`Root endpoint: ${rootResult ? '✅' : '❌'}`);
    console.log(`Test endpoint: ${testResult ? '✅' : '❌'}`);
    console.log(`404 handler: ${invalidResult ? '✅' : '❌'}`);

    if (healthResult && rootResult && testResult && invalidResult) {
      console.log('\n🎉 ¡Servidor simple funciona perfectamente!');
      console.log('\n🔧 PRÓXIMO PASO:');
      console.log('1. Detén el servidor simple (Ctrl+C)');
      console.log('2. Ejecuta: node server_fixed.js (servidor principal)');
      console.log('3. Ejecuta: node check_backend_status.js');
    } else {
      console.log('\n🚨 Hay problemas con el servidor simple');
      console.log('\n💡 SOLUCIÓN:');
      console.log('1. Verifica que no haya errores en la terminal del servidor');
      console.log('2. Reinicia el servidor simple');
      console.log('3. Ejecuta este script nuevamente');
    }
  };

  runTests();
};

// Run tests
testSimpleServer();
