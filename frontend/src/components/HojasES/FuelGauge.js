import React from 'react';
import { Gauge } from 'lucide-react';

const FuelGauge = ({ 
  percentage = 0, 
  onPercentageChange, 
  disabled = false 
}) => {
  // Validar que onPercentageChange sea una función
  if (typeof onPercentageChange !== 'function') {
    console.error('FuelGauge: onPercentageChange debe ser una función, recibido:', typeof onPercentageChange);
    return <div>Error: onPercentageChange no es una función</div>;
  }
  // Calcular el ángulo de la aguja (0-180 grados)
  const angle = (percentage / 100) * 180;
  
  // Determinar el color basado en el porcentaje
  const getGaugeColor = (percent) => {
    if (percent <= 20) return '#ef4444'; // Rojo
    if (percent <= 40) return '#f97316'; // Naranja
    if (percent <= 60) return '#eab308'; // Amarillo
    if (percent <= 80) return '#3b82f6'; // Azul
    return '#22c55e'; // Verde
  };

  const gaugeColor = getGaugeColor(percentage);

  // Generar opciones de porcentaje en rangos de 10
  const percentageOptions = [];
  for (let i = 0; i <= 100; i += 10) {
    percentageOptions.push(i);
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Gauge Visual */}
      <div className="relative">
        <svg width="100" height="60" viewBox="0 0 120 80" className="transform -rotate-0">
          {/* Fondo del gauge */}
          <path
            d="M 10 70 A 50 50 0 0 1 110 70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Colores del gauge */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          
          <path
            d="M 10 70 A 50 50 0 0 1 110 70"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Aguja */}
          <line
            x1="60"
            y1="70"
            x2={60 + 40 * Math.cos((angle - 360) * Math.PI / 180)}
            y2={70 - 40 * Math.sin((angle - 360) * Math.PI / 180)}
            stroke={gaugeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Centro del gauge */}
          <circle cx="60" cy="70" r="4" fill={gaugeColor} />
        </svg>
        
        {/* Porcentaje en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800" style={{ color: gaugeColor }}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Campo de selección de porcentaje */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nivel de Combustible
        </label>
        <select
          value={percentage}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (typeof onPercentageChange === 'function') {
              onPercentageChange(newValue);
            } else {
              console.error('onPercentageChange no es una función');
            }
          }}
          disabled={disabled}
          className={`px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {percentageOptions.map((value) => (
            <option key={value} value={value}>
              {value}%
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FuelGauge;
