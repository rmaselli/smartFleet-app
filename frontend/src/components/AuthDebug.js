import React, { useState, useEffect } from 'react';
import { Shield, Key, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthDebug = () => {
  const { user, token, isAuthenticated, loading, error } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [localStorageToken, setLocalStorageToken] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({});

  useEffect(() => {
    // Obtener token del localStorage
    const tokenFromStorage = localStorage.getItem('token');
    setLocalStorageToken(tokenFromStorage);

    // Información de la sesión
    setSessionInfo({
      userAgent: navigator.userAgent.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      localStorageAvailable: typeof Storage !== 'undefined',
      sessionStorageAvailable: typeof sessionStorage !== 'undefined'
    });
  }, [token]);

  const getStatusIcon = (isValid) => {
    return isValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (isValid) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBgColor = (isValid) => {
    return isValid ? 'bg-green-50' : 'bg-red-50';
  };

  const clearAllAuth = () => {
    console.log('🧹 AuthDebug: Clearing all authentication data...');
    
    // Limpiar localStorage
    localStorage.clear();
    console.log('🧹 AuthDebug: LocalStorage cleared');
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    console.log('🧹 AuthDebug: SessionStorage cleared');
    
    // Limpiar cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('🧹 AuthDebug: Cookies cleared');
    
    // Recargar página
    window.location.reload();
  };

  const refreshToken = () => {
    console.log('🔄 AuthDebug: Refreshing token from localStorage...');
    const tokenFromStorage = localStorage.getItem('token');
    setLocalStorageToken(tokenFromStorage);
    
    if (tokenFromStorage) {
      console.log('🔄 AuthDebug: Token found in localStorage:', tokenFromStorage.substring(0, 50) + '...');
    } else {
      console.log('🔄 AuthDebug: No token found in localStorage');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Debug de Autenticación
        </h3>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDebug ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {showDebug && (
        <div className="space-y-4">
          {/* Estado de Autenticación */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Estado de Autenticación
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Autenticado:</span>
                <span className={`${getStatusColor(isAuthenticated)} flex items-center`}>
                  {getStatusIcon(isAuthenticated)}
                  {isAuthenticated ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cargando:</span>
                <span className={loading ? 'text-yellow-600' : 'text-gray-600'}>
                  {loading ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Usuario:</span>
                <span className="text-gray-600">
                  {user ? `${user.username || user.email || 'Usuario'}` : 'No definido'}
                </span>
              </div>
              {error && (
                <div className="flex items-center justify-between">
                  <span>Error:</span>
                  <span className="text-red-600 text-xs">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Estado del Token */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Estado del Token
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Token en Estado:</span>
                <span className={`${getStatusColor(!!token)} flex items-center`}>
                  {getStatusIcon(!!token)}
                  {token ? 'Presente' : 'Ausente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Token en LocalStorage:</span>
                <span className={`${getStatusColor(!!localStorageToken)} flex items-center`}>
                  {getStatusIcon(!!localStorageToken)}
                  {localStorageToken ? 'Presente' : 'Ausente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sincronización:</span>
                <span className={`${getStatusColor(token === localStorageToken)} flex items-center`}>
                  {getStatusIcon(token === localStorageToken)}
                  {token === localStorageToken ? 'Sincronizado' : 'Desincronizado'}
                </span>
              </div>
              {token && (
                <div className="flex items-center justify-between">
                  <span>Longitud del Token:</span>
                  <span className="text-gray-600">{token.length} caracteres</span>
                </div>
              )}
              {token && (
                <div className="flex items-center justify-between">
                  <span>Vista Previa:</span>
                  <span className="text-gray-600 font-mono text-xs">
                    {token.substring(0, 50)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información de la Sesión */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">Información de la Sesión</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div>Timestamp: {sessionInfo.timestamp}</div>
              <div>URL: {sessionInfo.url}</div>
              <div>LocalStorage: {sessionInfo.localStorageAvailable ? 'Disponible' : 'No disponible'}</div>
              <div>SessionStorage: {sessionInfo.sessionStorageAvailable ? 'Disponible' : 'No disponible'}</div>
            </div>
          </div>

          {/* Acciones de Debug */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Acciones de Debug</h4>
            <div className="space-y-2">
              <button
                onClick={refreshToken}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Actualizar Estado del Token
              </button>
              <button
                onClick={clearAllAuth}
                className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                🧹 Limpiar Toda la Autenticación
              </button>
              <p className="text-xs text-yellow-700">
                ⚠️ La segunda opción limpiará toda la caché y recargará la página
              </p>
            </div>
          </div>

          {/* Logs de Consola */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2">Logs de Consola</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Abre DevTools (F12) para ver logs detallados</div>
              <div>• Busca mensajes con 🔐 AuthContext:</div>
              <div>• Verifica errores de red en la pestaña Network</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
