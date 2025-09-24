import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const ModalConfirmacionHoja = ({ isOpen, onClose, numeroHoja, plataforma }) => {
  if (!isOpen) return null;

  // Debug: Verificar datos recibidos
  console.log('🎨 Modal recibió plataforma:', plataforma);
  console.log('🔢 Modal recibió numeroHoja:', numeroHoja, 'tipo:', typeof numeroHoja);

  // Determinar el color basado en la plataforma
  const isUber = plataforma === 'UBER';
  const bgColor = isUber ? 'bg-green-500' : 'bg-red-500';
  const buttonColor = isUber ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  
  console.log('🎨 isUber:', isUber, 'bgColor:', bgColor);

  // Formatear el número de hoja con máscara de 10 dígitos
  const formatearNumeroHoja = (numero) => {
    if (!numero) return '0000000000';
    const numeroStr = numero.toString();
    const cerosFaltantes = 10 - numeroStr.length;
    const numeroFormateado = '0'.repeat(Math.max(0, cerosFaltantes)) + numeroStr;
    console.log('🔢 Formateando número:', { numero, numeroStr, cerosFaltantes, numeroFormateado });
    return numeroFormateado;
  };

  const numeroFormateado = formatearNumeroHoja(numeroHoja);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-10 max-w-4xl w-full mx-4 shadow-2xl">
        {/* Header con icono */}
        <div className="flex items-center justify-center mb-8">
          <CheckCircle className={`w-20 h-20 ${isUber ? 'text-green-500' : 'text-red-500'}`} />
        </div>

        {/* Contenido principal */}
        <div className={`${bgColor} rounded-xl p-8 text-white text-center mb-8 shadow-xl`}>
          <h2 className="text-3xl font-bold mb-4">FleetSmart</h2>
          <p className="text-xl mb-6">Hoja de Salida Numero:</p>
          <div className="text-6xl font-bold tracking-wider leading-tight">
            {plataforma}-{numeroFormateado}
          </div>
        </div>

        {/* Botón OK */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`${buttonColor} text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionHoja;
