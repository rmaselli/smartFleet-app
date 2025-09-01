import React, { useState, useEffect } from 'react';
import { checkApiHealth } from '../config/api';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const isHealthy = await checkApiHealth();
      setStatus(isHealthy ? 'connected' : 'error');
      setLastCheck(new Date());
    } catch (error) {
      setStatus('error');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'API Conectada',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          text: 'Error de Conexión',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'checking':
        return {
          icon: <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />,
          text: 'Verificando...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      default:
        return {
          icon: <WifiOff className="h-4 w-4 text-gray-500" />,
          text: 'Desconectado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor}`}>
      {statusInfo.icon}
      <span className={statusInfo.color}>{statusInfo.text}</span>
      
      {lastCheck && (
        <button
          onClick={checkStatus}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
          title={`Última verificación: ${lastCheck.toLocaleTimeString()}`}
        >
          Actualizar
        </button>
      )}
    </div>
  );
};

export default ApiStatus;
