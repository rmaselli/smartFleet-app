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

// Endpoints de check-master
CHECK_MASTER: {
  LIST: '/api/check-master',
  CREATE: '/api/check-master',
  UPDATE: (id) => `/api/check-master/${id}`,
  DELETE: (id) => `/api/check-master/${id}`,
  GET: (id) => `/api/check-master/${id}`,
  CATALOGO: '/api/check-master/cat'
},

// Endpoints de tipos de vehículos
TIPOS_VEHICULOS: {
  LIST: '/api/tipos-vehiculos',
  CREATE: '/api/tipos-vehiculos',
  UPDATE: (id) => `/api/tipos-vehiculos/${id}`,
  DELETE: (id) => `/api/tipos-vehiculos/${id}`,
  GET: (id) => `/api/tipos-vehiculos/${id}`,
  CATALOGO: '/api/tipos-vehiculos/cat'
},

  // //////////////  operaciones  //////////////
  // Endpoints de repuestos
  REPUESTOS: {
    LIST: '/api/repuestos',
    CREATE: '/api/repuestos',
    UPDATE: (id) => `/api/repuestos/${id}`,
    DELETE: (id) => `/api/repuestos/${id}`,
    GET: (id) => `/api/repuestos/${id}`
  },

  // Endpoints de salidas
  SALIDAS: {
    LIST: '/api/salidas',
    CREATE: '/api/salidas',
    UPDATE: (id) => `/api/salidas/${id}`,
    DELETE: (id) => `/api/salidas/${id}`,
    GET: (id) => `/api/salidas/${id}`
  },

  // Endpoints de servicios
  SERVICIOS: {
    LIST: '/api/servicios',
    CREATE: '/api/servicios',
    UPDATE: (id) => `/api/servicios/${id}`,
    DELETE: (id) => `/api/servicios/${id}`,
    GET: (id) => `/api/servicios/${id}`
  },


  // Endpoints de ingreso de repuestos
  INGRESO_REPUESTOS: {
    LIST: '/api/ingreso-repuestos',
    CREATE: '/api/ingreso-repuestos',
    UPDATE: (id) => `/api/ingreso-repuestos/${id}`,
    DELETE: (id) => `/api/ingreso-repuestos/${id}`,
    GET: (id) => `/api/ingreso-repuestos/${id}`
  },

// //////////////  operaciones  //////////////
  


// //////////////  Procesos  //////////////
  // Endpoints de cambio de pilotos
  CAMBIO_PILOTOS: {
    LIST: '/api/cambio-pilotos',
    CREATE: '/api/cambio-pilotos',
    UPDATE: (id) => `/api/cambio-pilotos/${id}`,
    DELETE: (id) => `/api/cambio-pilotos/${id}`,
    GET: (id) => `/api/cambio-pilotos/${id}`
  },

// //////////////  Procesos  //////////////


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
