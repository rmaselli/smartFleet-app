import React, { useState, useRef } from 'react';
import { Camera, Eye, X } from 'lucide-react';

const ImageUpload = ({ 
  onImageChange, 
  currentImage = null, 
  disabled = false 
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageChange(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openImageModal = () => {
    if (preview) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Foto del Kilometraje
        </label>
        
        {/* Área de subida de imagen */}
        <div
          onClick={handleClick}
          className={`relative w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            disabled 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
              : preview
                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal();
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    title="Ver imagen"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100"
                    title="Eliminar imagen"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {disabled ? 'Subida deshabilitada' : 'Haga clic para subir imagen'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF (máx. 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver imagen */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Vista previa de la imagen</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-auto">
              <img
                src={preview}
                alt="Imagen del kilometraje"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;

