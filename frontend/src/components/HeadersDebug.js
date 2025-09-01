import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

const HeadersDebug = () => {
  const [headers, setHeaders] = useState({});
  const [tokenInfo, setTokenInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Obtener información del token
    const token = localStorage.getItem('token');
    if (token) {
      setTokenInfo({
        exists: true,
        length: token.length,
        isValid: token.length < 1000,
        preview: token.substring(0, 50) + '...'
      });
    } else {
      setTokenInfo({
        exists: false,
        length: 0,
        isValid: false,
        preview: 'No token'
      });
    }

    // Obtener headers actuales
    const currentHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (token && token.length < 1000) {
      currentHeaders.Authorization = `Bearer ${token.substring(0, 50)}...`;
    }

    setHeaders(currentHeaders);
  }, []);

  const clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const getStatusColor = (isValid) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isValid) => {
    return isValid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          Debug de Headers
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
          {/* Estado del Token */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2">Estado del Token</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Existe:</span>
                <span className={getStatusColor(tokenInfo.exists)}>
                  {getStatusIcon(tokenInfo.exists)}
                  {tokenInfo.exists ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Longitud:</span>
                <span className={getStatusColor(tokenInfo.isValid)}>
                  {tokenInfo.length} caracteres
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Válido:</span>
                <span className={getStatusColor(tokenInfo.isValid)}>
                  {getStatusIcon(tokenInfo.isValid)}
                  {tokenInfo.isValid ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vista previa:</span>
                <span className="text-gray-600 font-mono text-xs">
                  {tokenInfo.preview}
                </span>
              </div>
            </div>
          </div>

          {/* Headers Actuales */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2">Headers de Request</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(headers).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono text-gray-600">{key}:</span>
                  <span className="font-mono text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones de Debug */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Acciones de Debug</h4>
            <div className="space-y-2">
              <button
                onClick={clearAllData}
                className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                🧹 Limpiar Todo (Caché + Recargar)
              </button>
              <p className="text-xs text-yellow-700">
                ⚠️ Esto limpiará toda la caché y recargará la página
              </p>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">Información del Sistema</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
              <div>Cookies habilitadas: {navigator.cookieEnabled ? 'Sí' : 'No'}</div>
              <div>LocalStorage: {typeof Storage !== 'undefined' ? 'Disponible' : 'No disponible'}</div>
              <div>SessionStorage: {typeof sessionStorage !== 'undefined' ? 'Disponible' : 'No disponible'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadersDebug;
