const http = require('http');

const testLoginComplete = () => {
  console.log('🧪 Prueba completa del sistema de login...\n');

  // Test 1: Health check
  const testHealth = () => {
    return new Promise((resolve) => {
      console.log('🏥 1. Verificando endpoint de health...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        console.log('<-----------por aqui------------------>|');
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const healthData = JSON.parse(data);
              console.log('   ✅ Health endpoint funciona');
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
        console.log('   ❌ Error en health check:', error.message);
        resolve(false);
      });

      req.end();
    });
  };

  // Test 2: Login con usuario válido
  const testValidLogin = () => {
    return new Promise((resolve) => {
      console.log('\n🔑 2. Probando login con usuario válido (ronald/1122)...');
      
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
              console.log('   ✅ Login exitoso');
              console.log('   Has Token:', !!loginData.token);
              console.log('   Has User:', !!loginData.user);
              console.log('   Message:', loginData.message);
              
              if (loginData.token) {
                console.log('   Token Length:', loginData.token.length);
                console.log('   Token Preview:', loginData.token.substring(0, 50) + '...');
                
                // Verificar formato JWT
                if (loginData.token.split('.').length === 3) {
                  console.log('   Token Format: ✅ Valid JWT');
                } else {
                  console.log('   Token Format: ❌ Invalid JWT');
                }
              } else {
                console.log('   ❌ TOKEN NO ENCONTRADO en la respuesta');
              }
              
              if (loginData.user) {
                console.log('   User ID:', loginData.user.id);
                console.log('   Username:', loginData.user.username);
                console.log('   Status:', loginData.user.status);
              } else {
                console.log('   ❌ USER DATA NO ENCONTRADO en la respuesta');
              }
              
              resolve({ success: true, data: loginData });
            } catch (error) {
              console.log('   ❌ Error parsing login response:', error.message);
              console.log('   Raw response:', data.substring(0, 200));
              resolve({ success: false, error: 'Parse error' });
            }
          } else {
            console.log('   ❌ Login falló con status:', res.statusCode);
            console.log('   Response:', data.substring(0, 200));
            resolve({ success: false, error: `HTTP ${res.statusCode}` });
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error en login request:', error.message);
        resolve({ success: false, error: error.message });
      });

      req.write(postData);
      req.end();
    });
  };

  // Test 3: Login con usuario inválido
  const testInvalidLogin = () => {
    return new Promise((resolve) => {
      console.log('\n❌ 3. Probando login con usuario inválido...');
      
      const postData = JSON.stringify({
        username: 'invalid',
        password: 'invalid'
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
          
          if (res.statusCode === 401) {
            try {
              const errorData = JSON.parse(data);
              console.log('   ✅ Login inválido correctamente rechazado');
              console.log('   Error:', errorData.error || 'Unauthorized');
              resolve(true);
            } catch (error) {
              console.log('   ⚠️  Status 401 pero error parsing response');
              resolve(false);
            }
          } else {
            console.log('   ❌ Login inválido no fue rechazado correctamente');
            console.log('   Status esperado: 401, recibido:', res.statusCode);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error en login inválido:', error.message);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  };

  // Test 4: Login con otro usuario válido
  const testOtherUserLogin = () => {
    return new Promise((resolve) => {
      console.log('\n👤 4. Probando login con otro usuario (otro/otro)...');
      
      const postData = JSON.stringify({
        username: 'otro',
        password: 'otro'
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
              console.log('   ✅ Login exitoso con usuario "otro"');
              console.log('   Has Token:', !!loginData.token);
              console.log('   Has User:', !!loginData.user);
              
              if (loginData.token) {
                console.log('   Token Length:', loginData.token.length);
              }
              
              resolve({ success: true, data: loginData });
            } catch (error) {
              console.log('   ❌ Error parsing response:', error.message);
              resolve({ success: false, error: 'Parse error' });
            }
          } else {
            console.log('   ❌ Login falló con status:', res.statusCode);
            resolve({ success: false, error: `HTTP ${res.statusCode}` });
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error en login:', error.message);
        resolve({ success: false, error: error.message });
      });

      req.write(postData);
      req.end();
    });
  };

  // Test 5: Verificar estructura de respuesta
  const testResponseStructure = (loginData) => {
    console.log('\n📊 5. Verificando estructura de respuesta...');
    
    const requiredFields = ['token', 'user', 'message'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!loginData[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length === 0) {
      console.log('   ✅ Todos los campos requeridos están presentes');
      console.log('   - token:', typeof loginData.token, loginData.token ? `${loginData.token.length} chars` : 'undefined');
      console.log('   - user:', typeof loginData.user, loginData.user ? 'object' : 'undefined');
      console.log('   - message:', typeof loginData.message, loginData.message || 'undefined');
    } else {
      console.log('   ❌ Campos faltantes:', missingFields.join(', '));
    }
    
    return missingFields.length === 0;
  };

  // Run all tests
  const runTests = async () => {
    console.log('🚀 Iniciando pruebas completas del sistema de login...\n');

    // Test 1: Health check
    const healthResult = await testHealth();
    if (!healthResult) {
      console.log('\n🚨 Health check falló. El backend no está funcionando correctamente.');
      console.log('💡 SOLUCIÓN: Verifica que el backend esté corriendo en puerto 3000');
      return;
    }

    // Test 2: Login válido
    const validLoginResult = await testValidLogin();
    
    // Test 3: Login inválido
    const invalidLoginResult = await testInvalidLogin();
    
    // Test 4: Otro usuario
    const otherLoginResult = await testOtherUserLogin();
    
    // Test 5: Estructura de respuesta (si el login fue exitoso)
    let structureResult = false;
    if (validLoginResult.success) {
      structureResult = testResponseStructure(validLoginResult.data);
    }

    // Summary
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('========================');
    console.log(`Health endpoint: ${healthResult ? '✅' : '❌'}`);
    console.log(`Login válido: ${validLoginResult.success ? '✅' : '❌'}`);
    console.log(`Login inválido: ${invalidLoginResult ? '✅' : '❌'}`);
    console.log(`Otro usuario: ${otherLoginResult.success ? '✅' : '❌'}`);
    console.log(`Estructura respuesta: ${structureResult ? '✅' : '❌'}`);

    // Analysis
    console.log('\n🔍 ANÁLISIS:');
    if (healthResult && validLoginResult.success && invalidLoginResult && otherLoginResult.success && structureResult) {
      console.log('🎉 ¡Sistema de login completamente funcional!');
      console.log('\n🚀 PRÓXIMO PASO:');
      console.log('Puedes usar el frontend para hacer login');
    } else if (healthResult && validLoginResult.success) {
      console.log('✅ Login básico funciona, pero hay problemas menores');
      if (!structureResult) {
        console.log('⚠️  La respuesta del servidor no tiene la estructura esperada');
        console.log('💡 Verifica que el backend esté enviando token, user y message');
      }
    } else if (!validLoginResult.success) {
      console.log('🚨 PROBLEMA PRINCIPAL: Login no funciona');
      console.log('\n💡 POSIBLES CAUSAS:');
      console.log('1. Base de datos no tiene usuarios');
      console.log('2. Error en la ruta de autenticación');
      console.log('3. Problema con bcrypt o JWT');
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Ejecuta: node fix_database.js');
      console.log('2. Verifica que no haya errores en la terminal del backend');
      console.log('3. Ejecuta este script nuevamente');
    }

    console.log('\n📋 PRÓXIMOS PASOS:');
    if (validLoginResult.success) {
      console.log('1. ✅ Backend funcionando - puedes probar el frontend');
      console.log('2. 🔍 Si hay problemas de estructura, verifica el backend');
    } else {
      console.log('1. 🔧 Corrige los problemas del backend');
      console.log('2. 🗄️  Verifica la base de datos');
      console.log('3. 🧪 Ejecuta este script nuevamente');
    }
  };

  runTests();
};

// Run tests
testLoginComplete();
