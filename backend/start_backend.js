const { spawn } = require('child_process');
const http = require('http');

const startBackend = () => {
  console.log('🚀 Iniciando backend...\n');

  // Verificar si el puerto 5000 está disponible
  const checkPort = () => {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
        timeout: 3000
      }, (res) => {
        resolve({ available: false, status: res.statusCode });
      });

      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
          resolve({ available: true });
        } else {
          resolve({ available: false, error: error.message });
        }
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ available: true });
      });

      req.end();
    });
  };

  // Iniciar el backend
  const startServer = async () => {
    // Verificar puerto primero
    const portCheck = await checkPort();
    
    if (!portCheck.available) {
      console.log('⚠️  Puerto 5000 ya está en uso');
      if (portCheck.status) {
        console.log(`   Status del endpoint: ${portCheck.status}`);
        console.log('   El backend ya está corriendo');
        return;
      }
    }

    console.log('✅ Puerto 5000 disponible, iniciando servidor...');

    // Iniciar servidor corregido
    const server = spawn('node', ['server_fixed.js'], {
      stdio: 'inherit',
      shell: true
    });

    server.on('error', (error) => {
      console.error('❌ Error iniciando servidor:', error.message);
    });

    server.on('close', (code) => {
      if (code !== 0) {
        console.log(`\n⚠️  Servidor terminado con código: ${code}`);
        console.log('💡 Esto puede ser normal si se detuvo manualmente');
      }
    });

    // Esperar un poco y verificar que el servidor esté funcionando
    setTimeout(async () => {
      const healthCheck = await checkPort();
      
      if (healthCheck.available === false && healthCheck.status === 200) {
        console.log('\n🎉 ¡Backend iniciado exitosamente!');
        console.log('📱 API disponible en: http://localhost:5000/api');
        console.log('🏥 Health check: http://localhost:5000/api/health');
        console.log('\n🔧 PRÓXIMO PASO:');
        console.log('1. Ejecuta: node test_login_complete.js');
        console.log('2. Si todo funciona, prueba el frontend');
      } else {
        console.log('\n⚠️  El servidor se inició pero no responde correctamente');
        console.log('💡 Verifica la terminal del servidor por errores');
      }
    }, 3000);

    // Manejar señales de terminación
    process.on('SIGINT', () => {
      console.log('\n🛑 Deteniendo servidor...');
      server.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Deteniendo servidor...');
      server.kill('SIGTERM');
      process.exit(0);
    });
  };

  startServer();
};

// Iniciar backend
startBackend();
