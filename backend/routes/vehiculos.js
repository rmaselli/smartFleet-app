const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los vehículos
router.get('/', auth, async (req, res) => {
  try {
    const [vehicles] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M001 ORDER BY id_vehiculo DESC'
    );
    
    res.json({
      success: true,
      data: vehicles,
      total: vehicles.length
    });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los vehículos' 
    });
  }
});

// GET - Obtener un vehículo por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [vehicles] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [id]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehículo no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: vehicles[0]
    });
  } catch (error) {
    console.error('Error getting vehicle:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el vehículo' 
    });
  }
});

// POST - Crear nuevo vehículo
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_sede').optional().isInt({ min: 1 }),
  body('marca_vehiculo').notEmpty().trim().escape(),
  body('placa_id').notEmpty().trim().escape(),
  body('tipo_vehiculo').isInt({ min: 1 }),
  body('modelo').notEmpty().trim().escape(),
  body('color').optional().trim().escape(),
  body('motor').optional().trim().escape(),
  body('chasis').optional().trim().escape(),
  body('anio_vehiculo').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('tipo_combustible').optional().trim().escape(),
  body('capacidad_carga').optional().trim().escape(),
  body('kilometraje').isInt({ min: 0 }),
  body('control_servicio').optional().trim().escape(),
  body('id_piloto').isInt({ min: 1 }),
  body('fe_compra').notEmpty().trim().escape(),
  body('estado').notEmpty().trim().escape(),
  //body('ultima_lectura').optional().isInt({ min: 1 }),
  //body('ultimo_km_taller').optional().isInt({ min: 1 }),
  //body('ultimo_servicio_taller').optional().trim().escape(),
  body('umbral_servicio').isInt({ min: 0, max: 100 }),
  //body('fe_registro').notEmpty().trim().escape(),
  body('observaciones').optional().trim().escape()
  ]
 , async (req, res) => {
  try {
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      id_empresa,
      id_sede,
      placa_id,
      tipo_vehiculo,
      marca_vehiculo,
      modelo,
      anio_vehiculo,
      color,
      motor,
      chasis,
      tipo_combustible,
      capacidad_carga,
      kilometraje,
      control_servicio,
      id_piloto,
      fe_compra,
      estado,
      //ultima_lectura,
      //ultimo_km_taller,
      //ultimo_servicio_taller,
      umbral_servicio,
      observaciones
    } = req.body;

    // Verificar si la placa ya existe
    const [existingVehicles] = await pool.execute(
      'SELECT id_vehiculo FROM FLVEHI.FLVEH_M001 WHERE placa_id = ?',
      [placa_id]
    );

    if (existingVehicles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un vehículo con esa placa'
      });
    }

    // Insertar nuevo vehículo
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M001 (
        id_empresa, id_sede, marca_vehiculo, placa_id,  modelo, anio_vehiculo, tipo_vehiculo, estado, color, motor, chasis, kilometraje, control_servicio, id_piloto, fe_compra, tipo_combustible, capacidad_carga, ultima_lectura, ultimo_km_taller, ultimo_servicio_taller, umbral_servicio, observaciones, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      [
        id_empresa || 1, id_sede || 1,  marca_vehiculo, placa_id, modelo, anio_vehiculo, tipo_vehiculo, estado, 
        color || null, motor || null, chasis || null, kilometraje , control_servicio || null, id_piloto , fe_compra || null,
        tipo_combustible || null, capacidad_carga || null, 0, 0 , null, umbral_servicio || 0,
        observaciones || null
      ]
      
      
    );

    // Obtener el vehículo creado
    const [newVehicle] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: newVehicle[0]
    });

  } catch (error) {
    console.error('Error al crear el vehículo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el vehículo' 
    });
  }
});

// PUT - Actualizar vehículo
router.put('/:id', auth, [
  body('id_empresa').notEmpty().trim().escape(),
  body('id_sede').notEmpty().trim().escape(),
  body('placa_id').notEmpty().trim().escape(),
  body('marca_vehiculo').notEmpty().trim().escape(),
  body('modelo').notEmpty().trim().escape(),
  body('anio_vehiculo').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('color').notEmpty().trim().escape(),
  body('motor').notEmpty().trim().escape(),
  body('chasis').notEmpty().trim().escape(),
  body('kilometraje').isInt({ min: 0 }),
  body('control_servicio').optional().trim().escape(),
  body('id_piloto').isInt({ min: 1 }),
  body('fe_compra').notEmpty().trim().escape(),
  body('combustible').notEmpty().trim().escape(),
  body('capacidad_carga').notEmpty().trim().escape(),
  body('umbral_servicio').notEmpty().trim().escape(),
  body('observaciones').notEmpty().trim().escape(),
  body('tipo_vehiculo').isInt({ min: 1 }),
  body('estado').notEmpty().trim().escape(),
  body('fe_modificacion').notEmpty().trim().escape()
], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      id_empresa,
      id_sede,
      placa_id,
      marca_vehiculo,
      modelo,
      anio_vehiculo,
      tipo_vehiculo,
      estado,
      color,
      motor,
      chasis,
      kilometraje,
      control_servicio,
      id_piloto,
      fe_compra,
      tipo_combustible,
      capacidad_carga,
      ultima_lectura,
      observaciones
    } = req.body;

    // Verificar si la placa ya existe en otro vehículo
    const [existingVehicles] = await pool.execute(
      'SELECT id_vehiculo FROM FLVEHI.FLVEH_M001 WHERE placa_id = ? AND id_vehiculo != ?',
      [placa_id, id]
    );

    if (existingVehicles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otro vehículo con esa placa'
      });
    }

    // Verificar que el vehículo existe
    const [currentVehicle] = await pool.execute(
      'SELECT id_vehiculo FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [id]
    );

    if (currentVehicle.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado'
      });
    }

    // Actualizar vehículo
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M001 SET 
        placa_id = ?, marca_vehiculo = ?, modelo = ?, anio_vehiculo = ?, tipo_vehiculo = ?, 
        estado = ?, color = ?, motor = ?, chasis = ?, kilometraje = ?,  control_servicio = ?, id_piloto = ?, 
        tipo_combustible = ?, capacidad_carga = ?,  observaciones = ?, fe_compra = ?,
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_vehiculo = ? AND id_empresa = ? AND id_sede = ?`,
      [
        placa_id, marca_vehiculo , modelo, anio_vehiculo, tipo_vehiculo, estado, color, motor,
        chasis, kilometraje, control_servicio, id_piloto, fe_compra, tipo_combustible, capacidad_carga,
        observaciones, fe_compra
      ]
    );

    // Obtener el vehículo actualizado
    const [updatedVehicle] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: updatedVehicle[0]
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el vehículo' 
    });
  }
});

// DELETE - Eliminar vehículo
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el vehículo existe
    const [currentVehicle] = await pool.execute(
      'SELECT id_vehiculo FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [id]
    );

    if (currentVehicle.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado'
      });
    }


    // Eliminar vehículo
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Vehículo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el vehículo' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      placa_id, 
      marca_vehiculo, 
      modelo, 
      estado, 
      tipo_vehiculo,
      id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M001 WHERE 1=1';
    let params = [];

    if (placa_id) {
      query += ' AND placa LIKE ?';
      params.push(`%${placa}%`);
    }

    if (marca_vehiculo) {
      query += ' AND marca_vehiculo LIKE ?';
      params.push(`%${marca_vehiculo}%`);
    }

    if (modelo) {
      query += ' AND modelo LIKE ?';
      params.push(`%${modelo}%`);
    }

    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }

    if (tipo_vehiculo) {
      query += ' AND tipo_vehiculo = ?';
      params.push(tipo_vehiculo);
    }

    if (id_empresa) {
      query += ' AND id_empresa = ?';
      params.push(id_empresa);
    }

    query += ' ORDER BY id_vehiculo DESC';

    const [vehicles] = await pool.execute(query, params);

    res.json({
      success: true,
      data: vehicles,
      total: vehicles.length
    });

  } catch (error) {
    console.error('Error searching vehicles:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar vehículos' 
    });
  }
});

module.exports = router;
