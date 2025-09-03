import ENV_CONFIG from './environment';

// Configuración centralizada de la API
const API_CONFIG = {
  // URLs base
  BASE_URL: ENV_CONFIG.API_URL,
  
  // Endpoints de autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    LOGOUT: '/api/auth/logout'
  },
  
  // Endpoints de vehículos
  VEHICULOS: {
    LIST: '/api/vehiculos',
    CREATE: '/api/vehiculos',
    UPDATE: (id) => `/api/vehiculos/${id}`,
    DELETE: (id) => `/api/vehiculos/${id}`,
    GET: (id) => `/api/vehiculos/${id}`
  },
  
// Endpoints de pilotos / choferes
PILOTOS: {
  LIST: '/api/pilotos',
  CREATE: '/api/pilotos',
  UPDATE: (id) => `/api/pilotos/${id}`,
  DELETE: (id) => `/api/pilotos/${id}`,
  GET: (id) => `/api/pilotos/${id}`,
  CATALOGO: '/api/pilotos/cat'
},

// Endpoints de sedes / talleres
SEDES: {
  LIST: '/api/sedes',
  CREATE: '/api/sedes',
  UPDATE: (id) => `/api/sedes/${id}`,
  DELETE: (id) => `/api/sedes/${id}`,
  GET: (id) => `/api/sedes/${id}`,
  CATALOGO: '/api/sedes/cat'
},

// Endpoints de clientes
CLIENTES: {
  LIST: '/api/clientes',
  CREATE: '/api/clientes',
  UPDATE: (id) => `/api/clientes/${id}`,
  DELETE: (id) => `/api/clientes/${id}`,
  GET: (id) => `/api/clientes/${id}`,
  CATALOGO: '/api/clientes/cat'
},


  // Endpoints de tareas
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
    GET: (id) => `/api/tasks/${id}`
  },
  
  // Health check
  HEALTH: '/api/health'
};

// Función para obtener la URL completa
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para verificar si la API está disponible
export const checkApiHealth = async () => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.HEALTH));
    return response.ok;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return false;
  }
};

export default API_CONFIG;
