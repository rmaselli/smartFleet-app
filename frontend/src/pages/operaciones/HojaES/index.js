import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import MainNavigation from '../../../components/MainNavigation';
import Breadcrumb from '../../../components/Breadcrumb';
import HeaderSection from '../../../components/HojasES/HeaderSection';
import ItemsList from '../../../components/HojasES/ItemsList';
import ItemsRevisados from '../../../components/HojasES/ItemsRevisados';
import ModalAnotaciones from '../../../components/HojasES/ModalAnotaciones';
import axiosInstance from '../../../utils/axiosConfig';

const HojaES = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Estados del encabezado
  const [clienteSeleccionado, setClienteSeleccionado] = useState('UBR');
  const [pilotoSeleccionado, setPilotoSeleccionado] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [kilometraje, setKilometraje] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // Estados de datos
  const [pilotos, setPilotos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [itemsChecklist, setItemsChecklist] = useState([]);
  const [itemsRevisados, setItemsRevisados] = useState([]);
  const [kilometrajeActual, setKilometrajeActual] = useState(0);
  
  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Validar formulario
  useEffect(() => {
    validateForm();
  }, [pilotoSeleccionado, vehiculoSeleccionado, kilometraje, clienteSeleccionado]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [pilotosRes, vehiculosRes, itemsRes] = await Promise.all([
        axiosInstance.get('/api/hoja-es/pilotos'),
        axiosInstance.get('/api/hoja-es/vehiculos'),
        axiosInstance.get('/api/hoja-es/items')
      ]);

      setPilotos(pilotosRes.data.data || []);
      setVehiculos(vehiculosRes.data.data || []);
      
      // Cargar items de checklist desde la base de datos
      const itemsData = itemsRes.data.data || [];
      console.log('Items cargados desde FLVEH_M007:', itemsData);
      setItemsChecklist(itemsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!pilotoSeleccionado) newErrors.piloto = 'Piloto es requerido';
    if (!vehiculoSeleccionado) newErrors.vehiculo = 'Vehículo es requerido';
    if (!kilometraje) newErrors.kilometraje = 'Kilometraje es requerido';
    if (kilometraje && parseInt(kilometraje) < kilometrajeActual) {
      newErrors.kilometraje = `El kilometraje no puede ser menor a ${kilometrajeActual}`;
    }
    if (!clienteSeleccionado) newErrors.cliente = 'Cliente es requerido';

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleVehiculoChange = async (vehiculoId) => {
    setVehiculoSeleccionado(vehiculoId);
    setKilometraje('');
    
    if (vehiculoId) {
      try {
        const response = await axiosInstance.get(`/api/hoja-es/vehiculo/${vehiculoId}/kilometraje`);
        setKilometrajeActual(response.data.data.kilometraje);
        setKilometraje(response.data.data.kilometraje.toString());
      } catch (error) {
        console.error('Error getting vehiculo kilometraje:', error);
      }
    }
  };

  const handlePassItem = (item) => {
    setItemsChecklist(prev => prev.filter(i => i.id_check !== item.id_check));
    setItemsRevisados(prev => [...prev, { ...item, anotacion: '' }]);
  };

  const handleQuitarItem = (item) => {
    setItemsRevisados(prev => prev.filter(i => i.id_check !== item.id_check));
    setItemsChecklist(prev => [...prev, { ...item, anotacion: '' }]);
  };

  const handleAnotacion = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSaveAnotacion = (anotacion) => {
    setItemsRevisados(prev => 
      prev.map(item => 
        item.id_check === selectedItem.id_check 
          ? { ...item, anotacion }
          : item
      )
    );
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleListo = async () => {
    if (!isFormValid || itemsRevisados.length === 0) {
      alert('Por favor complete todos los campos requeridos y revise al menos un item');
      return;
    }

    setLoading(true);
    try {
      // Crear la hoja principal
      const hojaData = {
        id_cliente: clienteSeleccionado,
        id_piloto: parseInt(pilotoSeleccionado),
        id_vehiculo: parseInt(vehiculoSeleccionado),
        placa_id: vehiculos.find(v => v.id_vehiculo === parseInt(vehiculoSeleccionado))?.placa_id || '',
        lectura_km_num: parseInt(kilometraje),
        observaciones
      };

      const hojaResponse = await axiosInstance.post('/api/hoja-es/hoja', hojaData);
      const id_hoja = hojaResponse.data.data.id_hoja;

      // Agregar items revisados
      for (const item of itemsRevisados) {
        await axiosInstance.post('/api/hoja-es/item-revisado', {
          id_hoja,
          id_check: item.id_check,
          anotacion: item.anotacion || ''
        });
      }

      alert('Hoja de salida creada exitosamente');
      
      // Resetear formulario
      setPilotoSeleccionado('');
      setVehiculoSeleccionado('');
      setKilometraje('');
      setObservaciones('');
      setItemsRevisados([]);
      
      // Recargar items de checklist desde la base de datos
      try {
        const itemsRes = await axiosInstance.get('/api/hoja-es/items');
        setItemsChecklist(itemsRes.data.data || []);
      } catch (error) {
        console.error('Error reloading items:', error);
      }
      
    } catch (error) {
      console.error('Error creating hoja:', error);
      alert('Error al crear la hoja de salida');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (window.confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.')) {
      setPilotoSeleccionado('');
      setVehiculoSeleccionado('');
      setKilometraje('');
      setObservaciones('');
      setItemsRevisados([]);
      
      // Recargar items de checklist desde la base de datos
      try {
        const itemsRes = await axiosInstance.get('/api/hoja-es/items');
        setItemsChecklist(itemsRes.data.data || []);
      } catch (error) {
        console.error('Error reloading items:', error);
      }
    }
  };

  if (loading && pilotos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Operaciones', href: '/operaciones' },
            { label: 'Salidas', href: '/operaciones/salidas' },
            { label: 'Hoja de Salida', href: '/operaciones/salidas/hoja-es' }
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Validación de Items a Revisar en la Salida</h1>
          
          {/* Sección de Encabezado */}
          <HeaderSection
            clienteSeleccionado={clienteSeleccionado}
            setClienteSeleccionado={setClienteSeleccionado}
            pilotoSeleccionado={pilotoSeleccionado}
            setPilotoSeleccionado={setPilotoSeleccionado}
            vehiculoSeleccionado={vehiculoSeleccionado}
            setVehiculoSeleccionado={handleVehiculoChange}
            kilometraje={kilometraje}
            setKilometraje={setKilometraje}
            observaciones={observaciones}
            setObservaciones={setObservaciones}
            pilotos={pilotos}
            vehiculos={vehiculos}
            kilometrajeActual={kilometrajeActual}
            errors={errors}
          />

          {/* Secciones de Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Items a Validar */}
            <ItemsList
              items={itemsChecklist}
              onPassItem={handlePassItem}
              loading={loading}
            />

            {/* Items Revisados */}
            <ItemsRevisados
              items={itemsRevisados}
              onQuitarItem={handleQuitarItem}
              onAnotacion={handleAnotacion}
              loading={loading}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={handleCancelar}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleListo}
              disabled={!isFormValid || itemsRevisados.length === 0 || loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Listo!'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Anotaciones */}
      <ModalAnotaciones
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAnotacion}
        item={selectedItem}
      />
    </div>
  );
};

export default HojaES;
