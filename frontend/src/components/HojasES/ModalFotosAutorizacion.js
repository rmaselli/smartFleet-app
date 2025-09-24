import React, { useState, useEffect } from 'react';
import { X, Camera, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';

const ModalFotosAutorizacion = ({ isOpen, onClose, hoja }) => {
  const [loading, setLoading] = useState(false);
  const [fotosMotocicleta, setFotosMotocicleta] = useState([]);
  const [fotosItems, setFotosItems] = useState([]);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Cargar fotos al abrir el modal
  useEffect(() => {
    if (isOpen && hoja) {
      loadFotos();
    }
  }, [isOpen, hoja]);

  const loadFotos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/hoja-es/autorizacion/hoja/${hoja.id_hoja}/fotos`);
      setFotosMotocicleta(response.data.data.fotos_motocicleta || []);
      setFotosItems(response.data.data.fotos_items || []);
    } catch (error) {
      console.error('Error loading fotos:', error);
      alert('Error al cargar las fotos');
    } finally {
      setLoading(false);
    }
  };

  const handleVerFoto = (foto, tipo) => {
    setSelectedFoto({ ...foto, tipo });
    setShowImageViewer(true);
  };

  const handleCloseImageViewer = () => {
    setSelectedFoto(null);
    setShowImageViewer(false);
  };

  const getTipoFotoText = (tipo) => {
    const tipos = {
      'lateral_derecha': 'Vista Lateral Derecha',
      'lateral_izquierda': 'Vista Lateral Izquierda',
      'frontal': 'Vista Frontal',
      'trasero': 'Vista Trasera',
      'odometro': 'Foto del Odómetro'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoFotoIcon = (tipo) => {
    const iconos = {
      'lateral_derecha': '🏍️',
      'lateral_izquierda': '🏍️',
      'frontal': '🏍️',
      'trasero': '🏍️',
      'odometro': '📊'
    };
    return iconos[tipo] || '📷';
  };

  if (!isOpen || !hoja) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fotos de la Hoja de Salida</h2>
            <p className="text-gray-600 mt-1">Hoja No. {hoja.id_hoja}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando fotos...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Fotos de Motocicleta */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Fotos de la Motocicleta</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {fotosMotocicleta.length} fotos
                  </span>
                </div>

                {fotosMotocicleta.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay fotos de motocicleta disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fotosMotocicleta.map((foto) => (
                      <div
                        key={foto.id_foto}
                        className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        onClick={() => handleVerFoto(foto, 'motocicleta')}
                      >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                        <img
                          src={`/api/hoja-es/foto/${foto.id_foto}`}
                          alt={getTipoFotoText(foto.tipo_foto)}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            console.error('Error loading image:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTipoFotoIcon(foto.tipo_foto)}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {getTipoFotoText(foto.tipo_foto)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {foto.nombre_archivo || 'Sin nombre'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fotos de Items */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Fotos de Items Revisados</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {fotosItems.length} fotos
                  </span>
                </div>

                {fotosItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay fotos de items disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fotosItems.map((foto) => (
                      <div
                        key={foto.id_foto_item}
                        className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        onClick={() => handleVerFoto(foto, 'item')}
                      >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                        <img
                          src={`/api/hoja-es/foto-item/${foto.id_foto_item}`}
                          alt={foto.desc_check}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            console.error('Error loading item image:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🔧</span>
                            <span className="text-sm font-medium text-gray-900">
                              {foto.desc_check}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {foto.nombre_archivo || 'Sin nombre'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal para ver imagen en grande */}
      {showImageViewer && selectedFoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 max-w-5xl max-h-[90vh] w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedFoto.tipo === 'motocicleta' 
                  ? getTipoFotoText(selectedFoto.tipo_foto)
                  : selectedFoto.desc_check
                }
              </h3>
              <button
                onClick={handleCloseImageViewer}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center items-center min-h-[400px] max-h-[70vh] overflow-auto bg-gray-100 rounded-lg">
              <img
                src={selectedFoto.tipo === 'motocicleta' 
                  ? `/api/hoja-es/foto/${selectedFoto.id_foto}`
                  : `/api/hoja-es/foto-item/${selectedFoto.id_foto_item}`
                }
                alt={selectedFoto.tipo === 'motocicleta' 
                  ? getTipoFotoText(selectedFoto.tipo_foto)
                  : selectedFoto.desc_check
                }
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                style={{ minHeight: '200px', minWidth: '200px' }}
                onError={(e) => {
                  console.error('Error loading image in viewer:', e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalFotosAutorizacion;
