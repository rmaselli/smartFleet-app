const http = require('http');

const checkBackendStatus = () => {
  console.log('🔍 Verificando estado del backend...\n');

  // Test 1: Quick health check
  const testHealth = () => {
    return new Promise((resolve) => {
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
              resolve({ 
                status: 'running', 
                message: 'Backend está corriendo correctamente',
                data: healthData
              });
            } catch (error) {
              resolve({ 
                status: 'error', 
                message: 'Backend responde pero con formato inválido',
                error: error.message
              });
            }
          } else {
            resolve({ 
              status: 'error', 
              message: `Backend responde con status ${res.statusCode}`,
              statusCode: res.statusCode,
              response: data.substring(0, 100)
            });
          }
        });
      });

      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
          resolve({ 
            status: 'stopped', 
            message: 'Backend no está corriendo (ECONNREFUSED)'
          });
        } else {
          resolve({ 
            status: 'error', 
            message: 'Error de conexión',
            error: error.message
          });
        }
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ 
          status: 'timeout', 
          message: 'Backend no responde (timeout)'
        });
      });

      req.end();
    });
  };

  // Test 2: Check if something is listening on port 5000
  const checkPort = () => {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/',
        method: 'GET',
        timeout: 3000
      }, (res) => {
        resolve({ 
          portOpen: true, 
          statusCode: res.statusCode,
          message: `Puerto 5000 está abierto, status: ${res.statusCode}`
        });
      });

      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
          resolve({ 
            portOpen: false, 
            message: 'Puerto 5000 está cerrado - nada escuchando'
          });
        } else {
          resolve({ 
            portOpen: false, 
            message: `Error en puerto 5000: ${error.message}`
          });
        }
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ 
          portOpen: false, 
          message: 'Puerto 5000 no responde (timeout)'
        });
      });

      req.end();
    });
  };

  // Run checks
  const runChecks = async () => {
    console.log('1️⃣ Verificando puerto 5000...');
    const portResult = await checkPort();
    console.log(`   ${portResult.portOpen ? '✅' : '❌'} ${portResult.message}`);

    if (portResult.portOpen) {
      console.log('\n2️⃣ Verificando endpoint /api/health...');
      const healthResult = await testHealth();
      console.log(`   ${healthResult.status === 'running' ? '✅' : '❌'} ${healthResult.message}`);
      
      if (healthResult.data) {
        console.log(`   📊 Backend info: ${healthResult.data.message || 'Sin mensaje'}`);
      }
    }

    // Summary and recommendations
    console.log('\n📊 RESUMEN:');
    console.log('===========');
    
    if (!portResult.portOpen) {
      console.log('🚨 PROBLEMA: Backend no está corriendo');
      console.log('\n💡 SOLUCIÓN:');
      console.log('1. Abre una nueva terminal');
      console.log('2. Navega al directorio backend: cd backend');
      console.log('3. Inicia el servidor: npm run dev');
      console.log('4. Espera a que aparezca "Server running on port 5000"');
      console.log('5. Ejecuta este script nuevamente');
    } else if (portResult.statusCode === 404) {
      console.log('⚠️  PROBLEMA: Puerto abierto pero endpoint no encontrado');
      console.log('\n💡 POSIBLES CAUSAS:');
      console.log('- Servidor no está completamente iniciado');
      console.log('- Error en la configuración de rutas');
      console.log('- Conflicto con otro servicio');
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Verifica la terminal del backend por errores');
      console.log('2. Reinicia el backend: Ctrl+C, luego npm run dev');
    } else if (portResult.statusCode === 200) {
      console.log('✅ Backend está funcionando correctamente');
      console.log('\n🚀 PRÓXIMO PASO:');
      console.log('Ejecuta: node test_login_complete.js');
    } else {
      console.log('❓ PROBLEMA: Puerto abierto pero respuesta inesperada');
      console.log(`Status: ${portResult.statusCode}`);
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Verifica la terminal del backend');
      console.log('2. Reinicia el backend');
    }
  };

  runChecks();
};

// Run check
checkBackendStatus();
