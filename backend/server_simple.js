const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ Health endpoint called');
  res.json({ 
    status: 'OK', 
    message: 'FleetSmart API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'FleetSmart Backend',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/auth/login']
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    requested: req.originalUrl,
    available: ['/api/health', '/', '/test']
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server Simple iniciado en puerto', PORT);
  console.log('📱 Endpoints disponibles:');
  console.log('   GET  /api/health');
  console.log('   GET  /');
  console.log('   GET  /test');
  console.log('🌐 URL: http://localhost:5000');
});

module.exports = app;
