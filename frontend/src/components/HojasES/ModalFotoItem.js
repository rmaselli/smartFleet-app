import React, { useState, useRef } from 'react';
import { Camera, X, Check, AlertCircle, Eye } from 'lucide-react';

const ModalFotoItem = ({ isOpen, onClose, onSave, item, idHoja }) => {
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
        setFoto({
          file,
          nombre_archivo: file.name,
          tamano_archivo: file.size,
          tipo_mime: file.type
        });
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setFoto(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    if (!foto) {
      alert('Por favor seleccione una foto');
      return;
    }

    // Llamar a onSave y esperar a que se complete
    await onSave(foto);
    // Cerrar el modal después de que se complete la operación
    handleClose();
  };

  const handleClose = () => {
    setFoto(null);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cargar Foto del Item</h2>
            <p className="text-gray-600 text-sm mt-1">{item?.desc_check || 'Item'}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Área de subida de imagen */}
          <div
            onClick={handleClick}
            className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              foto
                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
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
                        setShowPreview(true);
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      title="Ver imagen"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFoto();
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
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Haga clic para subir foto</p>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF (máx. 5MB)</p>
              </div>
            )}
          </div>

          {/* Información del archivo */}
          {foto && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">Foto seleccionada</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {foto.nombre_archivo} ({(foto.tamano_archivo / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!foto}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Listo
          </button>
        </div>
      </div>

      {/* Modal para ver imagen */}
      {showPreview && preview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Vista previa de la imagen</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-auto">
              <img
                src={preview}
                alt="Imagen del item"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalFotoItem;
