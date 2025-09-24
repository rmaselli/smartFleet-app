import React, { useState } from 'react';
import { Camera, Check, AlertCircle } from 'lucide-react';

const MotorcycleViews = ({ onOpenModal, fotosCargadas = 0, fotosFaltantes = 5 }) => {
  const [hoveredView, setHoveredView] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          <Camera className="w-4 h-4 inline mr-2" />
          Fotos de la Motocicleta
        </label>
        
        {/* Estado de fotos */}
        <div className="flex items-center space-x-2">
          {fotosCargadas === 5 ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
          <span className={`text-sm font-medium ${
            fotosCargadas === 5 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {fotosCargadas === 5 ? 'Fotos completas' : `Faltan ${fotosFaltantes} fotos`}
          </span>
        </div>
      </div>

      {/* Vista de motocicleta - Solo área de clic */}
      <div 
        className="relative w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 cursor-pointer hover:border-blue-400 transition-colors"
        onClick={onOpenModal}
        onMouseEnter={() => setHoveredView('center')}
        onMouseLeave={() => setHoveredView(null)}
      >
        {/* Fondo de la motocicleta central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">🏍️</div>
        </div>

        {/* Overlay de hover */}
        {hoveredView && (
          <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              Haga clic para cargar fotos
            </div>
          </div>
        )}

        {/* Texto central */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-gray-300 text-sm font-medium">Haga clic para cargar fotos</p>
            <p className="text-gray-400 text-xs mt-1">5 fotos requeridas</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MotorcycleViews;
