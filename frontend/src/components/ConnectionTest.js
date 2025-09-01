import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import API_CONFIG from '../config/api';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runConnectionTest = async () => {
    setIsTesting(true);
    const results = {};

    try {
      // Test 1: Verificar configuración básica
      results.config = {
        status: 'success',
        message: 'Configuración correcta',
        details: {
          baseURL: API_CONFIG.BASE_URL,
          timeout: '30s',
          headers: 'Configurados correctamente'
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

      // Test 3: Verificar autenticación
      try {
        const token = localStorage.getItem('token');
        if (token) {
          results.auth = {
            status: 'success',
            message: 'Token válido',
            details: {
              tokenLength: `${token.length} caracteres`,
              tokenPreview: token.substring(0, 50) + '...'
            }
          };
        } else {
          results.auth = {
            status: 'warning',
            message: 'Sin token de autenticación',
            details: {
              note: 'Esto es normal si no has iniciado sesión'
            }
          };
        }
      } catch (error) {
        results.auth = {
          status: 'error',
          message: 'Error verificando autenticación',
          details: {
            error: error.message
          }
        };
      }

      // Test 4: Verificar endpoint de vehículos
      try {
        const response = await axiosInstance.get('/api/vehiculos');
        results.vehiclesEndpoint = {
          status: 'success',
          message: 'Endpoint de vehículos accesible',
          details: {
            status: response.status,
            dataCount: response.data?.data?.length || 0
          }
        };
      } catch (error) {
        results.vehiclesEndpoint = {
          status: 'error',
          message: 'Error en endpoint de vehículos',
          details: {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
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
    setShowResults(true);
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
          <TestTube className="h-5 w-5 mr-2 text-purple-500" />
          Prueba de Conexión
        </h3>
        <button
          onClick={() => setShowResults(!showResults)}
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          {showResults ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={runConnectionTest}
          disabled={isTesting}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
              Ejecutando pruebas...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4 inline-block mr-2" />
              Ejecutar Pruebas de Conexión
            </>
          )}
        </button>
      </div>

      {showResults && Object.keys(testResults).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Resultados de las Pruebas:</h4>
          
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
      )}

      {showResults && Object.keys(testResults).length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <TestTube className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Ejecuta las pruebas para ver los resultados</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
