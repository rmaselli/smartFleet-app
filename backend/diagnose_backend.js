const http = require('http');
const net = require('net');

const diagnoseBackend = () => {
  console.log('🔍 Diagnóstico completo del backend...\n');

  // Test 1: Check if port 5000 is listening
  const testPort = (port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.setTimeout(5000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.connect(port, 'localhost');
    });
  };

  // Test 2: Test health endpoint with detailed error handling
  const testHealthEndpoint = () => {
    return new Promise((resolve) => {
      console.log('🏥 Probando endpoint /api/health...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        console.log('   ✅ Respuesta recibida');
        console.log('   Status:', res.statusCode);
        console.log('   Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log('   Raw Response:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
          
          if (res.statusCode === 200) {
            try {
              const healthData = JSON.parse(data);
              console.log('   ✅ Health check exitoso');
              console.log('   Data:', healthData);
              resolve({ success: true, data: healthData });
            } catch (error) {
              console.log('   ❌ Error parsing JSON:', error.message);
              resolve({ success: false, error: 'Invalid JSON' });
            }
          } else {
            console.log('   ❌ Health check falló con status:', res.statusCode);
            resolve({ success: false, error: `HTTP ${res.statusCode}` });
          }
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error en request:', error.message);
        resolve({ success: false, error: error.message });
      });

      req.setTimeout(10000, () => {
        console.log('   ❌ Timeout en request');
        req.destroy();
        resolve({ success: false, error: 'Timeout' });
      });

      req.end();
    });
  };

  // Test 3: Test root endpoint
  const testRootEndpoint = () => {
    return new Promise((resolve) => {
      console.log('\n🌐 Probando endpoint raíz /...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/',
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        console.log('   Status:', res.statusCode);
        console.log('   Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          console.log('   Response preview:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
          resolve({ success: true, status: res.statusCode });
        });
      });

      req.on('error', (error) => {
        console.log('   ❌ Error:', error.message);
        resolve({ success: false, error: error.message });
      });

      req.end();
    });
  };

  // Test 4: Test login endpoint
  const testLoginEndpoint = () => {
    return new Promise((resolve) => {
      console.log('\n🔑 Probando endpoint /api/auth/login...');
      
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
        console.log('   Status:', res.statusCode);
        console.log('   Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const loginData = JSON.parse(data);
              console.log('   ✅ Login endpoint funciona');
              console.log('   Has Token:', !!loginData.token);
              console.log('   Has User:', !!loginData.user);
              resolve({ success: true, data: loginData });
            } catch (error) {
              console.log('   ❌ Error parsing login response:', error.message);
              resolve({ success: false, error: 'Invalid JSON' });
            }
          } else {
            console.log('   ❌ Login endpoint falló con status:', res.statusCode);
            console.log('   Response:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
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

  // Run all tests
  const runDiagnosis = async () => {
    console.log('🚀 Iniciando diagnóstico...\n');

    // Test 1: Check port
    console.log('1️⃣ Verificando si el puerto 5000 está escuchando...');
    const portOpen = await testPort(5000);
    if (portOpen) {
      console.log('   ✅ Puerto 5000 está abierto');
    } else {
      console.log('   ❌ Puerto 5000 está cerrado');
      console.log('   💡 El backend no está corriendo. Ejecuta: npm run dev');
      return;
    }

    // Test 2: Health endpoint
    console.log('\n2️⃣ Probando endpoint de health...');
    const healthResult = await testHealthEndpoint();
    
    // Test 3: Root endpoint
    const rootResult = await testRootEndpoint();
    
    // Test 4: Login endpoint
    const loginResult = await testLoginEndpoint();

    // Summary
    console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
    console.log('=============================');
    console.log(`Puerto 5000: ${portOpen ? '✅ Abierto' : '❌ Cerrado'}`);
    console.log(`Health endpoint: ${healthResult.success ? '✅ Funciona' : '❌ Falló'}`);
    console.log(`Root endpoint: ${rootResult.success ? '✅ Funciona' : '❌ Falló'}`);
    console.log(`Login endpoint: ${loginResult.success ? '✅ Funciona' : '❌ Falló'}`);

    if (!portOpen) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: Backend no está corriendo');
      console.log('💡 SOLUCIÓN: Ejecuta en una terminal:');
      console.log('   cd backend');
      console.log('   npm run dev');
    } else if (!healthResult.success) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: Endpoint /api/health no responde correctamente');
      console.log('💡 POSIBLES CAUSAS:');
      console.log('   - Servidor no está completamente iniciado');
      console.log('   - Error en la configuración del servidor');
      console.log('   - Conflicto de puertos');
    } else {
      console.log('\n✅ Backend está funcionando correctamente');
    }

    console.log('\n🔧 PRÓXIMOS PASOS:');
    if (!portOpen) {
      console.log('1. Inicia el backend: npm run dev');
      console.log('2. Espera a que aparezca "Server running on port 5000"');
      console.log('3. Ejecuta este diagnóstico nuevamente');
    } else if (!healthResult.success) {
      console.log('1. Verifica que no haya errores en la terminal del backend');
      console.log('2. Reinicia el backend: Ctrl+C, luego npm run dev');
      console.log('3. Ejecuta este diagnóstico nuevamente');
    } else {
      console.log('1. Backend OK - puedes probar el login');
      console.log('2. Ejecuta: node test_login_complete.js');
    }
  };

  runDiagnosis();
};

// Run diagnosis
diagnoseBackend();
