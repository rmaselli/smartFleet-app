import axios from 'axios';
import API_CONFIG from '../config/api';

// Configuración base de Axios
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30 segundos
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Configuración para evitar problemas de headers
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 600; // Aceptar todos los códigos para manejo manual
  }
});

// Interceptor para requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Limpiar headers innecesarios para evitar problemas
    const cleanHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Agregar token solo si existe y es válido
    const token = localStorage.getItem('token');
    if (token && token.length < 1000) { // Verificar que el token no sea demasiado largo
      cleanHeaders.Authorization = `Bearer ${token}`;
    }
    
    // Aplicar headers limpios
    config.headers = cleanHeaders;
    
    // Log de requests para debugging
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📋 Headers:', Object.keys(cleanHeaders));
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Log de responses exitosos
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout Error:', error.message);
      return Promise.reject({
        ...error,
        message: 'La petición tardó demasiado en completarse. Verifica tu conexión a internet.'
      });
    }
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
      
      // Manejar errores específicos
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 431:
          // Request Header Fields Too Large
          console.error('❌ Headers demasiado grandes:', error.response.data);
          // Limpiar headers problemáticos y reintentar
          localStorage.removeItem('token');
          delete axiosInstance.defaults.headers.common['Authorization'];
          return Promise.reject({
            ...error,
            message: 'Error de configuración. Intenta limpiar la caché del navegador y volver a iniciar sesión.'
          });
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error desconocido');
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      });
    } else {
      // Error en la configuración de la petición
      console.error('❌ Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Función para configurar el token de autorización
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Función para limpiar la configuración
export const clearAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Función para limpiar completamente la configuración y caché
export const clearAllConfig = () => {
  // Limpiar headers de Axios
  delete axiosInstance.defaults.headers.common['Authorization'];
  delete axiosInstance.defaults.headers.common['X-Requested-With'];
  delete axiosInstance.defaults.headers.common['X-CSRF-Token'];
  
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  
  // Limpiar cookies relacionadas con la sesión
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('🧹 Configuración y caché limpiados completamente');
};

export default axiosInstance;
