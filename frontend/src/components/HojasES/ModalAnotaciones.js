import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ModalAnotaciones = ({ isOpen, onClose, onSave, item }) => {
  const [anotacion, setAnotacion] = useState('');

  useEffect(() => {
    if (item) {
      setAnotacion(item.anotacion || '');
    }
  }, [item]);

  const handleSave = () => {
    onSave(anotacion);
    setAnotacion('');
  };

  const handleClose = () => {
    setAnotacion('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Anotaciones
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item: {item?.desc_check || '-->' || item.cod_abreviado || `Item ${item.id_check}`}
            </label>
            <textarea
              value={anotacion}
              onChange={(e) => setAnotacion(e.target.value)}
              placeholder="Ingrese sus observaciones aquí..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAnotaciones;
