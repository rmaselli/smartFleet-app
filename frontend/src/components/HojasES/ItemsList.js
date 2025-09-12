import React from 'react';
import { Star, CheckCircle,Check } from 'lucide-react';

const ItemsList = ({ items, onPassItem, loading }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="bg-gray-600 text-white px-4 py-3 rounded-t-lg">
        <h3 className="text-lg font-semibold">Check List</h3>
      </div>

      {/* Lista de Items */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay items pendientes de revisar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id_check}
                className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    A
                  </div>
                   <span className="text-gray-800 font-medium flex flex-col">
                     {item.desc_check || item.cod_abreviado || `Item ${item.id_check}`}
                    <div className="text-xs text-slate-900">Abrev: <span className="text-xs text-gray-500">{item.cod_abreviado}</span>
                    </div>
                   </span>
                </div>
                
                <button
                  onClick={() => onPassItem(item)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  <span>Pass</span>
                  <span className="text-xs"></span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsList;
