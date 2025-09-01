import React, { useState } from 'react';
import { LogIn, TestTube, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import API_CONFIG from '../config/api';

const LoginDebug = () => {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });

  const runLoginTest = async () => {
    setIsTesting(true);
    const results = {};

    try {
      // Test 1: Verificar configuración de la API
      results.config = {
        status: 'success',
        message: 'Configuración correcta',
        details: {
          baseURL: API_CONFIG.BASE_URL,
          loginEndpoint: API_CONFIG.AUTH.LOGIN,
          fullURL: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`
        }
      };

      // Test 2: Verificar conectividad básica
      try {
        const startTime = Date.now();
        const response = await axiosInstance.get('/api/health');
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        results.connectivity = {
          status: 'success',
          message: 'Conexión exitosa',
          details: {
            responseTime: `${responseTime}ms`,
            status: response.status,
            data: response.data
          }
        };
      } catch (error) {
        results.connectivity = {
          status: 'error',
          message: 'Error de conectividad',
          details: {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
          }
        };
      }

      // Test 3: Verificar endpoint de login
      try {
        console.log('🧪 LoginDebug: Testing login endpoint...');
        const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, testCredentials);
        
        console.log('🧪 LoginDebug: Login response:', response);
        
        results.loginEndpoint = {
          status: 'success',
          message: 'Endpoint de login accesible',
          details: {
            status: response.status,
            hasToken: !!response.data.token,
            tokenType: typeof response.data.token,
            tokenLength: response.data.token ? response.data.token.length : 0,
            userData: response.data.user ? 'Presente' : 'Ausente',
            message: response.data.message
          }
        };
      } catch (error) {
        console.error('🧪 LoginDebug: Login test failed:', error);
        
        results.loginEndpoint = {
          status: 'error',
          message: 'Error en endpoint de login',
          details: {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
            requestData: {
              url: error.config?.url,
              method: error.config?.method,
              headers: error.config?.headers
            }
          }
        };
      }

      // Test 4: Verificar estructura de respuesta
      try {
        const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, testCredentials);
        
        const responseStructure = {
          hasToken: !!response.data.token,
          hasUser: !!response.data.user,
          hasMessage: !!response.data.message,
          tokenType: typeof response.data.token,
          userType: typeof response.data.user,
          messageType: typeof response.data.message
        };

        results.responseStructure = {
          status: responseStructure.hasToken ? 'success' : 'error',
          message: responseStructure.hasToken ? 'Estructura correcta' : 'Estructura incorrecta',
          details: responseStructure
        };
      } catch (error) {
        results.responseStructure = {
          status: 'error',
          message: 'No se pudo verificar estructura',
          details: {
            error: error.message
          }
        };
      }

    } catch (error) {
      results.general = {
        status: 'error',
        message: 'Error general en las pruebas',
        details: {
          error: error.message
        }
      };
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const testWithCustomCredentials = async () => {
    if (!testCredentials.username || !testCredentials.password) {
      alert('Por favor ingresa credenciales válidas');
      return;
    }

    setIsTesting(true);
    
    try {
      console.log('🧪 LoginDebug: Testing with custom credentials...');
      console.log('🧪 LoginDebug: Credentials:', { username: testCredentials.username, password: '***' });
      console.log('🧪 LoginDebug: API URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`);
      
      const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, testCredentials);
      
      console.log('🧪 LoginDebug: Custom login response:', response);
      console.log('🧪 LoginDebug: Response status:', response.status);
      console.log('🧪 LoginDebug: Response data:', response.data);
      console.log('🧪 LoginDebug: Response headers:', response.headers);
      
      // Analyze response structure
      const responseAnalysis = {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        hasMessage: !!response.data.message,
        tokenType: typeof response.data.token,
        userType: typeof response.data.user,
        messageType: typeof response.data.message,
        tokenLength: response.data.token ? response.data.token.length : 0,
        fullResponse: response.data
      };
      
      console.log('🧪 LoginDebug: Response analysis:', responseAnalysis);
      
      if (response.data.token) {
        alert(`✅ Login exitoso!\n\nToken: Presente (${response.data.token.length} caracteres)\nUsuario: ${response.data.user ? 'Presente' : 'Ausente'}\nMensaje: ${response.data.message || 'No especificado'}`);
      } else {
        alert(`⚠️ Login exitoso pero sin token!\n\nRespuesta del servidor:\n${JSON.stringify(response.data, null, 2)}`);
      }
      
    } catch (error) {
      console.error('🧪 LoginDebug: Custom login failed:', error);
      console.error('🧪 LoginDebug: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Error en login';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ Error en login: ${errorMessage}\n\nRevisa la consola para más detalles.`);
    }
    
    setIsTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <LogIn className="h-5 w-5 mr-2 text-green-500" />
          Debug de Login
        </h3>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm text-green-600 hover:text-green-800"
        >
          {showDebug ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {showDebug && (
        <div className="space-y-4">
          {/* Credenciales de Prueba */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">Credenciales de Prueba</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-blue-700 mb-1">Usuario:</label>
                <input
                  type="text"
                  value={testCredentials.username}
                  onChange={(e) => setTestCredentials({...testCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-300 rounded text-sm"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm text-blue-700 mb-1">Contraseña:</label>
                <input
                  type="password"
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-300 rounded text-sm"
                  placeholder="admin123"
                />
              </div>
                             <button
                 onClick={testWithCustomCredentials}
                 disabled={isTesting}
                 className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
               >
                 🧪 Probar Login con Credenciales
               </button>
               <button
                 onClick={() => {
                   setTestCredentials({ username: 'otro', password: 'otro' });
                   testWithCustomCredentials();
                 }}
                 disabled={isTesting}
                 className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 mt-2"
               >
                 🚀 Probar con Usuario "otro"
               </button>
               <button
                 onClick={() => {
                   setTestCredentials({ username: 'ronald', password: '1122' });
                   testWithCustomCredentials();
                 }}
                 disabled={isTesting}
                 className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
               >
                 🔑 Probar con Usuario "ronald"
               </button>
               <button
                 onClick={() => {
                   setTestCredentials({ username: 'admin', password: 'admin123' });
                   testWithCustomCredentials();
                 }}
                 disabled={isTesting}
                 className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 mt-2"
               >
                 👑 Probar con Usuario "admin"
               </button>
            </div>
          </div>

          {/* Pruebas Automáticas */}
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-medium text-purple-800 mb-2">Pruebas Automáticas</h4>
            <button
              onClick={runLoginTest}
              disabled={isTesting}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Ejecutando pruebas...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 inline-block mr-2" />
                  Ejecutar Pruebas de Login
                </>
              )}
            </button>
          </div>

          {/* Resultados de las Pruebas */}
          {Object.keys(testResults).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-2">Resultados de las Pruebas:</h4>
              
              <div className="space-y-3">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className={`rounded-lg p-3 ${getStatusBgColor(result.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className={`font-medium ${getStatusColor(result.status)}`}>
                          {result.message}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {testName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    
                    {result.details && (
                      <div className="mt-2 text-sm text-gray-600">
                        {Object.entries(result.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-mono text-gray-500">{key}:</span>
                            <span className="font-mono text-gray-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información de Debug */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Información de Debug</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• Abre DevTools (F12) para ver logs detallados</div>
              <div>• Busca mensajes con 🧪 LoginDebug:</div>
              <div>• Verifica la pestaña Network para ver la petición HTTP</div>
              <div>• Revisa la consola para errores detallados</div>
            </div>
          </div>

          {/* Estado Actual */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2">Estado Actual</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Base URL: {API_CONFIG.BASE_URL}</div>
              <div>Login Endpoint: {API_CONFIG.AUTH.LOGIN}</div>
              <div>URL Completa: {API_CONFIG.BASE_URL}{API_CONFIG.AUTH.LOGIN}</div>
              <div>Credenciales: {testCredentials.username} / {'*'.repeat(testCredentials.password.length)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDebug;
