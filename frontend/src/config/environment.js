// Configuración del entorno
const ENV_CONFIG = {
  // URLs de la API
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Configuración de la aplicación
  APP_NAME: process.env.REACT_APP_NAME || 'FleetSmart',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Configuración de desarrollo
  DEBUG: process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  
  // Timeouts
  TIMEOUT: {
    API_REQUEST: 30000,    // 30 segundos
    API_RESPONSE: 30000,   // 30 segundos
    HEALTH_CHECK: 10000    // 10 segundos
  },
    


  // Configuración de la fecha
  DATE_FORMAT: 'en-GB', 


};


// Función para obtener la configuración del entorno
export const getEnvConfig = (key) => {
  return ENV_CONFIG[key];
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = () => {
  return ENV_CONFIG.DEBUG;
};

// Función para obtener la URL de la API
export const getApiUrl = () => {
  return ENV_CONFIG.API_URL;
};

export default ENV_CONFIG;
