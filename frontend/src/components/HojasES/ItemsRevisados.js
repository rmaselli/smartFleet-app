import React from 'react';
import { Star, X, FileText, Trash2, Image } from 'lucide-react';

const ItemsRevisados = ({ items, onQuitarItem, onAnotacion, onFoto, loading }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="bg-green-300 text-gray-800 px-4 py-3 rounded-t-lg">
        <h3 className="text-lg font-semibold">Check Done</h3>
      </div>

      {/* Lista de Items */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <span className="ml-2 text-gray-600">Cargando items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay items revisados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id_check}
                className={`p-3 border rounded-lg transition-colors ${
                  item.anotacion || item.tiene_foto
                    ? 'bg-yellow-200 border-yellow-300' 
                    : 'bg-pink-50 border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      A
                    </div>
                    <div>
                       <span className="text-gray-800 font-medium flex flex-col">
                         <div className="flex items-center space-x-2">
                           <span>{item.desc_check || '-->' || item.cod_abreviado || `Item ${item.id_check}`}</span>
                           {item.tiene_foto && (
                             <div className="flex items-center space-x-1">
                               <Image className="w-4 h-4 text-blue-600" />
                               <span className="text-xs text-blue-600 font-medium">Foto</span>
                             </div>
                           )}
                         </div>
                         <div className="text-xs text-slate-900">Abrev: <span className="text-xs text-gray-500">{item.cod_abreviado}</span>
                        </div>
                       </span>
                      {item.anotacion && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.anotacion}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onQuitarItem(item)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm font-medium"
                    >
                      <span className="text-xs"></span>
                      <Trash2 className="w-4 h-4" />
                      <span>Quitar</span>
                    </button>
                    
                    <button
                      onClick={() => onAnotacion(item)}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Notas</span>
                      
                    </button>
                    <button
                      onClick={() => onFoto(item)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm font-medium"
                    >
                      <Image className="w-4 h-4" />
                      <span>Foto</span>
                    </button>


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsRevisados;
