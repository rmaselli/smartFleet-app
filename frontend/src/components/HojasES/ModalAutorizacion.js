import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Fuel } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';

const ModalAutorizacion = ({ isOpen, onClose, onSuccess, hoja }) => {
  const [loading, setLoading] = useState(false);
  const [vales, setVales] = useState([]);
  const [valeSeleccionado, setValeSeleccionado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Cargar vales disponibles al abrir el modal
  useEffect(() => {
    if (isOpen && hoja) {
      loadVales();
      setObservaciones(hoja.observaciones || '');
    }
  }, [isOpen, hoja]);

  const loadVales = async () => {
    try {
      // Usar la nueva API de vales de combustible
      const response = await axiosInstance.get('/api/vales-combustible');
      if (response.data.success) {
        // Filtrar solo vales disponibles (ACT, DISP, ING)
        const valesDisponibles = response.data.data.filter(vale => 
          ['ACT', 'DISP', 'ING'].includes(vale.estado)
        );
        
        // Formatear para el select
        const valesFormateados = valesDisponibles.map(vale => ({
          vale_id: vale.id_vale,
          display_text: `${vale.proveedor} - Q.${parseFloat(vale.valor_vale).toFixed(2)} - Cupón: ${vale.cupon} - Código: ${vale.codigo}`,
          valor_vale: vale.valor_vale,
          cupon: vale.cupon,
          codigo: vale.codigo,
          proveedor: vale.proveedor,
          tipo_combustible: vale.tipo_combustible,
          estado: vale.estado
        }));
        
        setVales(valesFormateados);
      } else {
        setVales([]);
      }
    } catch (error) {
      console.error('Error loading vales:', error);
      alert('Error al cargar los vales de combustible');
      setVales([]);
    }
  };

  const handleAutorizar = async () => {
    if (!valeSeleccionado) {
      alert('Por favor seleccione un vale de combustible');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/api/hoja-es/autorizacion/autorizar', {
        id_hoja: hoja.id_hoja,
        id_vale: parseInt(valeSeleccionado)
      });

      alert('Hoja de salida autorizada exitosamente');
      onSuccess();
    } catch (error) {
      console.error('Error authorizing hoja:', error);
      alert('Error al autorizar la hoja de salida');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValeSeleccionado('');
    setObservaciones('');
    onClose();
  };

  if (!isOpen || !hoja) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Autorizar Hoja de Salida</h2>
            <p className="text-gray-600 mt-1">Hoja No. {hoja.id_hoja}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información de la Hoja */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ID Hoja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Hoja
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                {hoja.id_hoja}
              </div>
            </div>

            {/* Plataforma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                {hoja.id_plataforma}
              </div>
            </div>

            {/* Piloto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Piloto
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                {hoja.nombres} {hoja.apellidos}
              </div>
            </div>

            {/* Placa Moto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa Moto
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                {hoja.placa_vehiculo}
              </div>
            </div>

            {/* Lectura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lectura (Km)
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                {hoja.lectura_km_num?.toLocaleString() || 'N/A'}
              </div>
            </div>

            {/* Número de Vale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Vale <span className="text-red-500">*</span>
              </label>
              <select
                value={valeSeleccionado}
                onChange={(e) => setValeSeleccionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un vale de combustible</option>
                {vales.map((vale) => (
                  <option key={vale.vale_id} value={vale.vale_id}>
                    {vale.display_text}
                  </option>
                ))}
              </select>
              {vales.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No hay vales de combustible disponibles
                </p>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Items con observaciones */}
          {hoja.items_con_observaciones && hoja.items_con_observaciones.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items con Observaciones
              </label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-2">
                  {hoja.items_con_observaciones.map((item, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-900">{item.desc_check}:</span>
                      <span className="text-gray-700 ml-2">{item.anotacion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Información del Vale Seleccionado */}
          {valeSeleccionado && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Fuel className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Vale de Combustible Seleccionado:</span>
                </div>
                {(() => {
                  const valeSeleccionadoData = vales.find(v => v.vale_id === parseInt(valeSeleccionado));
                  return valeSeleccionadoData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-900">Proveedor:</span>
                        <span className="text-blue-800 ml-2">{valeSeleccionadoData.proveedor}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Tipo:</span>
                        <span className="text-blue-800 ml-2">{valeSeleccionadoData.tipo_combustible}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Valor:</span>
                        <span className="text-blue-800 ml-2">Q. {parseFloat(valeSeleccionadoData.valor_vale).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Cupón:</span>
                        <span className="text-blue-800 ml-2">{valeSeleccionadoData.cupon}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Código:</span>
                        <span className="text-blue-800 ml-2">{valeSeleccionadoData.codigo}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Estado:</span>
                        <span className="text-blue-800 ml-2">{valeSeleccionadoData.estado}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAutorizar}
            disabled={!valeSeleccionado || loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Autorizando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Autorizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAutorizacion;
