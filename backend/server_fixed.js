const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const vehiculosRoutes = require('./routes/vehiculos');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico primero
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS básico
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Helmet con configuración básica
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Morgan para logging
app.use(morgan('combined'));

// Health check endpoint - DEFINIDO ANTES de las rutas
app.get('/api/health', (req, res) => {
  console.log('✅ Health endpoint called');
  res.json({ 
    status: 'OK', 
    message: 'FleetSmart API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'FleetSmart Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/api/health', '/api/auth/login', '/api/vehiculos', '/api/tasks']
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/vehiculos', vehiculosRoutes);

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

// 404 handler - debe ser el último
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    requested: req.originalUrl,
    available: ['/api/health', '/', '/api/auth/login', '/api/vehiculos', '/api/tasks']
  });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('⚠️  Server will continue without database connection');
  }
});

// Configurar timeouts del servidor
server.timeout = 30000;        // 30 segundos
server.keepAliveTimeout = 5000; // 5 segundos
server.headersTimeout = 10000;  // 10 segundos

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
