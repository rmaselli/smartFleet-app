// Configuración del servidor OPTIMIZADA para evitar error 431
const serverConfig = {
  // Configuración de timeouts
  timeout: {
    request: 30000,        // 30 segundos para requests
    response: 30000,       // 30 segundos para responses
    idle: 120000,          // 2 minutos para conexiones inactivas
    keepAlive: 5000        // 5 segundos para keep-alive
  },
  
  // Configuración de límites OPTIMIZADA para evitar 431
  limits: {
    body: '10mb',          // Límite del body de requests
    headers: 1000,         // AUMENTADO: Número máximo de headers (era 100)
    fieldSize: 10 * 1024 * 1024, // AUMENTADO: 10MB para campos individuales (era 2MB)
    files: 10,             // AUMENTADO: Número máximo de archivos (era 5)
    fileSize: 10 * 1024 * 1024,  // AUMENTADO: 10MB por archivo (era 5MB)
    // Nuevos límites para evitar 431
    headerSize: 64 * 1024,        // 64KB para headers individuales
    maxHeaderSize: 128 * 1024     // 128KB para todos los headers combinados
  },
  
  // Configuración de CORS OPTIMIZADA
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      // Headers adicionales que podrían ser necesarios
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400
  },
  
  // Configuración de seguridad OPTIMIZADA
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
  },
  
  // Configuración específica para evitar error 431
  http: {
    maxHeaderSize: 128 * 1024,    // 128KB para headers HTTP
    maxHeaderCount: 1000,         // Máximo número de headers
    keepAliveTimeout: 5000,       // Timeout para keep-alive
    headersTimeout: 10000         // Timeout para headers
  },
  
  // Configuración de Express específica
  express: {
    trustProxy: true,             // Confiar en proxy headers
    subdomainOffset: 2,           // Offset para subdominios
    strictRouting: false,         // Routing no estricto
    caseSensitiveRouting: false,  // Routing no sensible a mayúsculas
    viewCache: true,              // Cache de vistas
    queryParser: 'extended'       // Parser de queries extendido
  }
};

module.exports = serverConfig;



