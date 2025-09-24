// Configuración del servidor
const serverConfig = {
  // Configuración de timeouts
  timeout: {
    request: 30000,        // 30 segundos para requests
    response: 30000,       // 30 segundos para responses
    idle: 120000,          // 2 minutos para conexiones inactivas
    keepAlive: 5000        // 5 segundos para keep-alive
  },
  
  // Configuración de límites
  limits: {
    body: '10mb',          // Límite del body de requests
    headers: 200,          // Número máximo de headers
    headerSize: 16384,     // 16KB para tamaño de headers
    fieldSize: 2 * 1024 * 1024, // 2MB para campos individuales
    files: 5,              // Número máximo de archivos
    fileSize: 5 * 1024 * 1024   // 5MB por archivo
  },
  
  // Configuración de CORS
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400
  },
  
  // Configuración de seguridad
  security: {
    helmet: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }
  },
  
  // Configuración de logging
  logging: {
    level: 'combined',
    format: 'combined'
  }
};

module.exports = serverConfig;
