import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';

const TaskModal = ({ task, onClose, onTaskCreated, onTaskUpdated, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    assigned_to: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        assigned_to: task.assigned_to || ''
      });
    }
  }, [task, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.title.length > 255) {
      newErrors.title = 'El título no puede exceder 255 caracteres';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const url = mode === 'edit' ? `/api/tasks/${task.id}` : '/api/tasks';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (mode === 'edit') {
          onTaskUpdated(data.task);
        } else {
          onTaskCreated(data.task);
        }
        
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className={`input ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Ingresa el título de la tarea"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="form-error">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className={`input resize-none ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Describe la tarea (opcional)"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Prioridad
              </label>
              <select
                id="priority"
                name="priority"
                className="input"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {isEditMode && (
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  className="input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="due_date" className="form-label">
              Fecha de Vencimiento
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="due_date"
                name="due_date"
                type="date"
                className="input pl-10"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="form-group">
            <label htmlFor="assigned_to" className="form-label">
              Asignar a (ID de usuario)
            </label>
            <input
              id="assigned_to"
              name="assigned_to"
              type="number"
              className="input"
              placeholder="ID del usuario (opcional)"
              value={formData.assigned_to}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deja vacío si no quieres asignar la tarea a nadie
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex justify-center items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 