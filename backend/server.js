const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const vehiculosRoutes = require('./routes/vehiculos');
const pilotosRoutes = require('./routes/pilotos');
const sedesRoutes = require('./routes/sedes');
const clientesRoutes = require('./routes/clientes');
const checkMasterRoutes = require('./routes/check-master');
const tiposVehiculosRoutes = require('./routes/tipos-vehiculos');
// Rutas de Operaciones
const salidasRoutes = require('./routes/operaciones/salidas');
const serviciosRoutes = require('./routes/operaciones/servicios');
const repuestosRoutes = require('./routes/operaciones/repuestos');
const ingresoRepuestosRoutes = require('./routes/operaciones/ingreso-repuestos');
const hojaESRoutes = require('./routes/operaciones/HojaES');
// Rutas de Procesos
const cambioPilotosRoutes = require('./routes/procesos/cambio-pilotos');

const { initDatabase } = require('./config/database');
const serverConfig = require('./config/server');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet(serverConfig.security.helmet));

// Configurar CORS con opciones específicas
app.use(cors(serverConfig.cors));

// Configurar límites para headers y body
app.use(express.json({ 
  limit: serverConfig.limits.body,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: serverConfig.limits.body 
}));

// Middleware para manejar headers grandes
app.use((req, res, next) => {
  // Aumentar límite de headers
  req.setMaxListeners(0);
  res.setMaxListeners(0);
  
  // Configurar límites de headers más generosos
  req.headersLimit = 16384; // 16KB para headers
  res.headersLimit = 16384; // 16KB para headers
  
  next();
});

app.use(morgan(serverConfig.logging.format));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/pilotos', pilotosRoutes);
app.use('/api/sedes', sedesRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/check-master', checkMasterRoutes);
app.use('/api/tipos-vehiculos', tiposVehiculosRoutes);
// Rutas de Operaciones
app.use('/api/salidas', salidasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/repuestos', repuestosRoutes);
app.use('/api/ingreso-repuestos', ingresoRepuestosRoutes);
app.use('/api/hoja-es', hojaESRoutes);
// Rutas de Procesos
app.use('/api/cambio-pilotos', cambioPilotosRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FleetSmart API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Manejar errores específicos de headers
  if (err.code === 'HPE_HEADER_OVERFLOW' || err.statusCode === 431) {
    return res.status(431).json({ 
      error: 'Request Header Fields Too Large',
      message: 'Los headers de la petición son demasiado grandes. Intenta limpiar la caché del navegador.'
    });
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  
  // Initialize database
  await initDatabase();
});

// Configurar timeouts del servidor
server.timeout = serverConfig.timeout.request;
server.keepAliveTimeout = serverConfig.timeout.keepAlive;
server.headersTimeout = serverConfig.timeout.response;

module.exports = app; 