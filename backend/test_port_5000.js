const http = require('http');

const testPort5000 = () => {
  console.log('🧪 Verificando que el backend funcione en puerto 5000...\n');

  // Test 1: Health endpoint
  const testHealth = () => {
    return new Promise((resolve) => {
      console.log('🏥 Probando /api/health en puerto 5000...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const healthData = JSON.parse(data);
              console.log('   ✅ Health endpoint funciona en puerto 5000');
              console.log('   Status:', healthData.status);
              console.log('   Message:', healthData.message);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing health response:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ Health endpoint falló con status:', res.statusCode);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
          console.log('   ❌ Puerto 5000 no está escuchando');
          console.log('   💡 El backend no está corriendo en puerto 5000');
        } else {
          console.log('   ❌ Error en health check:', error.message);
        }
        resolve(false);
      });

      req.on('timeout', () => {
        console.log('   ❌ Timeout en health check');
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  };

  // Test 2: Login endpoint
  const testLogin = () => {
    return new Promise((resolve) => {
      console.log('\n🔑 Probando /api/auth/login en puerto 5000...');
      
      const postData = JSON.stringify({
        username: 'ronald',
        password: '1122'
      });

      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log('   Status:', res.statusCode);
          
          if (res.statusCode === 200) {
            try {
              const loginData = JSON.parse(data);
              console.log('   ✅ Login funciona en puerto 5000');
              console.log('   Has Token:', !!loginData.token);
              console.log('   Has User:', !!loginData.user);
              resolve(true);
            } catch (error) {
              console.log('   ❌ Error parsing login response:', error.message);
              resolve(false);
            }
          } else {
            console.log('   ❌ Login falló con status:', res.statusCode);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error en login:', error.message);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  };

  // Run tests
  const runTests = async () => {
    console.log('🚀 Iniciando pruebas del puerto 5000...\n');

    const healthResult = await testHealth();
    const loginResult = await testLogin();

    // Summary
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('========================');
    console.log(`Health endpoint: ${healthResult ? '✅' : '❌'}`);
    console.log(`Login endpoint: ${loginResult ? '✅' : '❌'}`);

    if (healthResult && loginResult) {
      console.log('\n🎉 ¡Backend funcionando perfectamente en puerto 5000!');
      console.log('\n🚀 PRÓXIMO PASO:');
      console.log('Puedes usar el frontend para hacer login');
    } else {
      console.log('\n🚨 Hay problemas con el backend en puerto 5000');
      console.log('\n💡 SOLUCIÓN:');
      if (!healthResult) {
        console.log('1. Verifica que el backend esté corriendo: node server_fixed.js');
        console.log('2. Verifica que no haya errores en la terminal del backend');
      }
      if (!loginResult) {
        console.log('3. Verifica la base de datos: node fix_database_complete.js');
      }
      console.log('4. Ejecuta este script nuevamente');
    }
  };

  runTests();
};

// Run tests
testPort5000();


