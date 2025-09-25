import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MainNavigation from '../../components/MainNavigation';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  Fuel, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Barcode
} from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import API_CONFIG from '../../config/api';
import { getEnvConfig } from '../../config/environment';

const ValesCombustible = () => {
  const { user } = useAuth();
  const [valesCombustible, setValesCombustible] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVale, setEditingVale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterTipoCombustible, setFilterTipoCombustible] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [valeToDelete, setValeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id_empresa: 1,
    id_sede_origen: 1,
    tipo_combustible: 'Gasolina',
    proveedor: '',
    fe_emision: '',
    fe_validez: '',
    cod_barra: '',
    cupon: '',
    codigo: '',
    valor_vale: '',
    observaciones: '',
    estado: 'ACT'
  });

  const [formErrors, setFormErrors] = useState({});

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' },
    { id: 'vales-combustible', label: 'Vales de Combustible', path: '/catalogos/vales-combustible' }
  ];

  // Estados disponibles
  const estados = [
    { value: 'ACT', label: 'Activo' },
    { value: 'INA', label: 'Inactivo' },
    { value: 'APR', label: 'Aprobado' },
    { value: 'AUT', label: 'Autorizado' },
    { value: 'REC', label: 'Rechazado' }
  ];

  // Tipos de combustible
  const tiposCombustible = [
    'Gasolina',
    'Diesel',
    'Eléctrico',
    'Híbrido',
    'Gas Natural',
    'Otro'
  ];

  // Cargar Vales de Combustible
  const loadValesCombustible = async () => {
    setLoading(true);
    try {
      console.log('🚀 Cargando vales de combustible desde:', API_CONFIG.VALES_COMBUSTIBLE.LIST);
      const response = await axiosInstance.get(API_CONFIG.VALES_COMBUSTIBLE.LIST);
      console.log('✅ Respuesta de vales de combustible:', response.data);
      
      if (response.data.success) {
        setValesCombustible(response.data.data);
        console.log(`📊 ${response.data.data.length} vales de combustible cargados`);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setValesCombustible([]);
      }
    } catch (error) {
      console.error('❌ Error cargando vales de combustible:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 500) {
        alert('Error del servidor. Por favor, intenta más tarde.');
      } else if (error.code === 'ECONNABORTED') {
        alert('Timeout de conexión. Verifica tu conexión a internet.');
      } else if (!error.response) {
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error desconocido'}`);
      }
      
      setValesCombustible([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadValesCombustible();
  }, []);

  // Filtrar vales de combustible
  const filteredValesCombustible = valesCombustible.filter(vale => {
    const matchesSearch = vale.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vale.cod_barra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vale.cupon?.toString().includes(searchTerm) ||
                         vale.codigo?.toString().includes(searchTerm);
    
    const matchesEstado = filterEstado === 'all' || vale.estado === filterEstado;
    const matchesTipoCombustible = filterTipoCombustible === 'all' || vale.tipo_combustible === filterTipoCombustible;
    
    return matchesSearch && matchesEstado && matchesTipoCombustible;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.tipo_combustible) errors.tipo_combustible = 'El tipo de combustible es requerido';
    if (!formData.proveedor.trim()) errors.proveedor = 'El proveedor es requerido';
    if (!formData.fe_emision) errors.fe_emision = 'La fecha de emisión es requerida';
    if (!formData.fe_validez) errors.fe_validez = 'La fecha de validez es requerida';
    if (!formData.cupon) errors.cupon = 'El cupón es requerido';
    if (!formData.codigo) errors.codigo = 'El código es requerido';
    if (!formData.valor_vale) errors.valor_vale = 'El valor del vale es requerido';
    if (formData.valor_vale && isNaN(formData.valor_vale)) errors.valor_vale = 'El valor del vale debe ser un número';
    if (formData.valor_vale && parseFloat(formData.valor_vale) < 0) errors.valor_vale = 'El valor del vale debe ser mayor o igual a 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Abrir formulario para nuevo vale
  const openNewForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      id_empresa: 1,
      id_sede_origen: 1,
      tipo_combustible: 'Gasolina',
      proveedor: '',
      fe_emision: today,
      fe_validez: today,
      cod_barra: '',
      cupon: '',
      codigo: '',
      valor_vale: '',
      observaciones: '',
      estado: 'ACT'
    });
    setFormErrors({});
    setEditingVale(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEditForm = (vale) => {
    setFormData({
      id_empresa: vale.id_empresa || 1,
      id_sede_origen: vale.id_sede_origen || 1,
      tipo_combustible: vale.tipo_combustible || 'Gasolina',
      proveedor: vale.proveedor || '',
      fe_emision: vale.fe_emision ? vale.fe_emision.split('T')[0] : '',
      fe_validez: vale.fe_validez ? vale.fe_validez.split('T')[0] : '',
      cod_barra: vale.cod_barra || '',
      cupon: vale.cupon ? vale.cupon.toString() : '',
      codigo: vale.codigo ? vale.codigo.toString() : '',
      valor_vale: vale.valor_vale ? vale.valor_vale.toString() : '',
      observaciones: vale.observaciones || '',
      estado: vale.estado
    });
    setFormErrors({});
    setEditingVale(vale);
    setShowForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingVale(null);
    setFormData({
      id_empresa: 1,
      id_sede_origen: 1,
      tipo_combustible: 'Gasolina',
      proveedor: '',
      fe_emision: '',
      fe_validez: '',
      cod_barra: '',
      cupon: '',
      codigo: '',
      valor_vale: '',
      observaciones: '',
      estado: 'ACT'
    });
    setFormErrors({});
  };

  // Guardar vale de combustible
  const saveValeCombustible = async () => {
    console.log('<<Entra>>', formData);
    if (!validateForm()) return;

    try {
      console.log('🚀 Guardando vale de combustible:', formData);
      
      if (editingVale) {
        // Actualizar
        console.log('📝 Actualizando vale de combustible ID:', editingVale.id_vale);
        const response = await axiosInstance.put(API_CONFIG.VALES_COMBUSTIBLE.UPDATE(editingVale.id_vale), formData);
        console.log('✅ Vale de combustible actualizado:', response.data);
        
        if (response.data.success) {
          alert('Vale de combustible actualizado exitosamente');
          await loadValesCombustible();
          closeForm();
        }
      } else {
        // Crear nuevo
        console.log('🆕 Creando nuevo vale de combustible');
        const response = await axiosInstance.post(API_CONFIG.VALES_COMBUSTIBLE.CREATE, formData);
        console.log('✅ Vale de combustible creado:', response.data);
        
        if (response.data.success) {
          alert('Vale de combustible creado exitosamente');
          await loadValesCombustible();
          closeForm();
        }
      }
    } catch (error) {
      console.error('❌ Error guardando vale de combustible:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.error || 'Datos inválidos';
        alert(`Error de validación: ${errorMsg}`);
      } else if (error.response?.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 500) {
        alert('Error del servidor. Por favor, intenta más tarde.');
      } else if (error.code === 'ECONNABORTED') {
        alert('Timeout de conexión. Verifica tu conexión a internet.');
      } else if (!error.response) {
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error desconocido'}`);
      }
    }
  };

  // Eliminar vale de combustible
  const deleteValeCombustible = async (id) => {
    try {
      const response = await axiosInstance.delete(API_CONFIG.VALES_COMBUSTIBLE.DELETE(id));
      if (response.data.success) {
        await loadValesCombustible();
      }
    } catch (error) {
      console.error('Error deleting vale de combustible:', error);
    }
  };

  // Mostrar confirmación de eliminación
  const showDeleteConfirmation = (vale) => {
    setValeToDelete(vale);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (valeToDelete) {
      await deleteValeCombustible(valeToDelete.id_vale);
      setShowDeleteConfirm(false);
      setValeToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setValeToDelete(null);
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACT':
        return 'bg-green-100 text-green-800';
      case 'INA':
        return 'bg-gray-100 text-gray-800';
      case 'APR':
        return 'bg-blue-100 text-blue-800';
      case 'AUT':
        return 'bg-purple-100 text-purple-800';
      case 'REC':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    const estado = estados.find(e => e.value === status);
    return estado ? estado.label : 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Vales de Combustible
            </h1>
            <p className="text-slate-600">
              Administra los vales de combustible de la flota
            </p>
            
            <div className="mt-2">
              <button
                onClick={loadValesCombustible}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Recargar Vales'}
              </button>
            </div>
          </div>
          
          <button 
            onClick={openNewForm}
            className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Vale de Combustible</span>
          </button>
        </div>

        {/* SECCIÓN 1: FORMULARIO DE CAPTURA */}
        {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingVale ? 'Editar Vale de Combustible' : 'Nuevo Vale de Combustible'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Tipo de Combustible */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Combustible *
                </label>
                <select
                  name="tipo_combustible"
                  value={formData.tipo_combustible}
                  onChange={handleFormChange}
                  className={`input ${formErrors.tipo_combustible ? 'border-red-500' : ''}`}
                >
                  {tiposCombustible.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {formErrors.tipo_combustible && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.tipo_combustible}</p>
                )}
              </div>

              {/* Proveedor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proveedor *
                </label>
                <input
                  type="text"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleFormChange}
                  className={`input ${formErrors.proveedor ? 'border-red-500' : ''}`}
                  placeholder="Nombre del proveedor"
                  maxLength={45}
                />
                {formErrors.proveedor && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.proveedor}</p>
                )}
              </div>

              {/* Fecha de Emisión */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Emisión *
                </label>
                <input
                  type="date"
                  name="fe_emision"
                  value={formData.fe_emision}
                  onChange={handleFormChange}
                  className={`input ${formErrors.fe_emision ? 'border-red-500' : ''}`}
                />
                {formErrors.fe_emision && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_emision}</p>
                )}
              </div>

              {/* Fecha de Validez */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Validez *
                </label>
                <input
                  type="date"
                  name="fe_validez"
                  value={formData.fe_validez}
                  onChange={handleFormChange}
                  className={`input ${formErrors.fe_validez ? 'border-red-500' : ''}`}
                />
                {formErrors.fe_validez && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_validez}</p>
                )}
              </div>

              {/* Código de Barras */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código de Barras
                </label>
                <input
                  type="text"
                  name="cod_barra"
                  value={formData.cod_barra}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="Código de barras"
                  maxLength={50}
                />
              </div>

              {/* Cupón */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cupón *
                </label>
                <input
                  type="number"
                  name="cupon"
                  value={formData.cupon}
                  onChange={handleFormChange}
                  className={`input ${formErrors.cupon ? 'border-red-500' : ''}`}
                  placeholder="Número de cupón"
                  min="1"
                />
                {formErrors.cupon && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cupon}</p>
                )}
              </div>

              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código *
                </label>
                <input
                  type="number"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleFormChange}
                  className={`input ${formErrors.codigo ? 'border-red-500' : ''}`}
                  placeholder="Código del vale"
                  min="1"
                />
                {formErrors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.codigo}</p>
                )}
              </div>

              {/* Valor del Vale */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor del Vale *
                </label>
                <input
                  type="number"
                  name="valor_vale"
                  value={formData.valor_vale}
                  onChange={handleFormChange}
                  className={`input ${formErrors.valor_vale ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.valor_vale && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.valor_vale}</p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleFormChange}
                  className="input"
                >
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Observaciones */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleFormChange}
                rows="3"
                className="input w-full"
                placeholder="Observaciones adicionales..."
                maxLength={100}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={closeForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveValeCombustible}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingVale ? 'Actualizar' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: LISTADO DE REGISTROS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por proveedor, código de barras, cupón, código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado.value} value={estado.value}>{estado.label}</option>
              ))}
            </select>

            <select
              value={filterTipoCombustible}
              onChange={(e) => setFilterTipoCombustible(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los tipos</option>
              {tiposCombustible.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <button
              onClick={loadValesCombustible}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
          </div>

          {/* Tabla de Vales de Combustible */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tipo / Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cupón / Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Cargando vales de combustible...</span>
                        <span className="text-xs text-gray-500">Verificando conexión con el servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredValesCombustible.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Fuel className="h-12 w-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">No se encontraron vales de combustible</span>
                        <span className="text-xs text-gray-500">Intenta ajustar los filtros o agregar un nuevo vale</span>
                        <button
                          onClick={openNewForm}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Vale de Combustible
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredValesCombustible.map((vale) => (
                    <tr key={vale.id_vale} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Fuel className="h-6 w-6 text-orange-600 fill-orange-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {vale.proveedor}
                            </div>
                            <div className="text-sm text-slate-500">
                              {vale.cod_barra && `BarCode: ${vale.cod_barra}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div className="font-medium">{vale.tipo_combustible}</div>
                          <div className="text-slate-500">
                            Emisión: {vale.fe_emision ? new Date(vale.fe_emision).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-slate-500">
                            Validez: {vale.fe_validez ? new Date(vale.fe_validez).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div>Cupón: {vale.cupon}</div>
                          <div>Código: {vale.codigo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          Q. {vale.valor_vale ? parseFloat(vale.valor_vale).toFixed(2) : '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vale.estado)}`}>
                          {getStatusText(vale.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {vale.fe_registro ? new Date(vale.fe_registro).toLocaleDateString(getEnvConfig('DATE_FORMAT')) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(vale)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(vale)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Información de registros */}
          <div className="mt-4 text-sm text-slate-500">
            Mostrando {filteredValesCombustible.length} de {valesCombustible.length} vales de combustible
          </div>
        </div>
      </main>

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-slate-700 mb-6">
              ¿Estás seguro de que quieres eliminar el vale de combustible "{valeToDelete?.proveedor || valeToDelete?.id_vale}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValesCombustible;
