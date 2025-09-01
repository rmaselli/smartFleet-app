import React, { useState } from 'react';
import { Edit, Trash2, Calendar, User, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TaskModal from './TaskModal';

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  getStatusIcon, 
  getStatusText, 
  getPriorityColor, 
  getPriorityText 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          onDelete(task.id);
        } else {
          console.error('Error deleting task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <>
      <div className="card hover:shadow-md transition-shadow duration-200 group">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(task.status)}
            <span className="text-sm font-medium text-gray-700">
              {getStatusText(task.status)}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Priority Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {getPriorityText(task.priority)}
            </span>
          </div>

          {/* Metadata */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {task.due_date && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Vence: {formatDate(task.due_date)}</span>
              </div>
            )}
            
            {task.assigned_to_username && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Asignado a: {task.assigned_to_username}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Creado por: {task.created_by_username}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Creada el {formatDate(task.created_at)}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={onUpdate}
          mode="edit"
        />
      )}
    </>
  );
};

export default TaskCard; 