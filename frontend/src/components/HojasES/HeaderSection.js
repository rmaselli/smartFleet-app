import React from 'react';
import { Star, User, Truck, Gauge, FileText } from 'lucide-react';

const HeaderSection = ({
  clienteSeleccionado,
  setClienteSeleccionado,
  pilotoSeleccionado,
  setPilotoSeleccionado,
  vehiculoSeleccionado,
  setVehiculoSeleccionado,
  kilometraje,
  setKilometraje,
  observaciones,
  setObservaciones,
  pilotos,
  vehiculos,
  kilometrajeActual,
  errors
}) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Header</h2>
        
        {/* Botones de Cliente */}
        <div className="flex space-x-2">
          <button
            onClick={() => setClienteSeleccionado('DYA')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              clienteSeleccionado === 'DYA' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>DYA</span>
          </button>
          <button
            onClick={() => setClienteSeleccionado('UBR')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              clienteSeleccionado === 'UBR' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>UBR</span>
          </button>
        </div>
      </div>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Piloto */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            <User className="w-4 h-4 inline mr-2" />
            Piloto
          </label>
          <select
            value={pilotoSeleccionado}
            onChange={(e) => setPilotoSeleccionado(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.piloto ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            <option value="">Seleccionar piloto</option>
            {pilotos.map((piloto) => (
              <option key={piloto.id_piloto} value={piloto.id_piloto}>
                {piloto.nombres} {piloto.apellidos}
              </option>
            ))}
          </select>
          {errors.piloto && (
            <p className="text-red-400 text-xs">{errors.piloto}</p>
          )}
        </div>

        {/* Vehículo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            <Truck className="w-4 h-4 inline mr-2" />
            Vehículo
          </label>
          <select
            value={vehiculoSeleccionado}
            onChange={(e) => setVehiculoSeleccionado(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vehiculo ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.placa_id} - {vehiculo.marca_vehiculo} {vehiculo.modelo}
              </option>
            ))}
          </select>
          {errors.vehiculo && (
            <p className="text-red-400 text-xs">{errors.vehiculo}</p>
          )}
        </div>

        {/* Kilometraje */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            <Gauge className="w-4 h-4 inline mr-2" />
            Kilometraje
          </label>
          <input
            type="number"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            placeholder={kilometrajeActual ? kilometrajeActual.toString() : "10000"}
            min={kilometrajeActual || 0}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.kilometraje ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {kilometrajeActual > 0 && (
            <p className="text-xs text-gray-400">
              Kilometraje actual: {kilometrajeActual}
            </p>
          )}
          {errors.kilometraje && (
            <p className="text-red-400 text-xs">{errors.kilometraje}</p>
          )}
        </div>

        {/* Observaciones */}
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-300">
            <FileText className="w-4 h-4 inline mr-2" />
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones"
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
