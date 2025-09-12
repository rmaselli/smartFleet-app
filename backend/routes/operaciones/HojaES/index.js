const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../../../config/database');
const { auth } = require('../../../middleware/auth');

const router = express.Router();

// GET - Obtener items de checklist (FLVEH_M007)
router.get('/items', auth, async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT id_check, desc_check, cod_abreviado, estado FROM FLVEHI.FLVEH_M007 WHERE estado = "ACT" ORDER BY id_check ASC'
    );
    
    console.log('Items obtenidos de FLVEH_M007:', items);
    
    res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error) {
    console.error('Error getting checklist items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los items del checklist' 
    });
  }
});

// GET - Obtener pilotos disponibles (FLVEH_M004)
router.get('/pilotos', auth, async (req, res) => {
  try {
    const [pilotos] = await pool.execute(
      'SELECT id_piloto, nombres, apellidos FROM FLVEHI.FLVEH_M004 WHERE estado = "ACT" ORDER BY nombres ASC'
    );
    
    res.json({
      success: true,
      data: pilotos,
      total: pilotos.length
    });
  } catch (error) {
    console.error('Error getting pilotos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los pilotos' 
    });
  }
});

// GET - Obtener vehículos disponibles (FLVEH_M001)
router.get('/vehiculos', auth, async (req, res) => {
  try {
    const [vehiculos] = await pool.execute(
      'SELECT id_vehiculo, placa_id, marca_vehiculo, modelo, kilometraje FROM FLVEHI.FLVEH_M001 WHERE estado = "ACT" ORDER BY placa_id ASC'
    );
    
    res.json({
      success: true,
      data: vehiculos,
      total: vehiculos.length
    });
  } catch (error) {
    console.error('Error getting vehiculos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los vehículos' 
    });
  }
});

// GET - Obtener kilometraje de un vehículo específico
router.get('/vehiculo/:id/kilometraje', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [vehiculo] = await pool.execute(
      'SELECT kilometraje FROM FLVEHI.FLVEH_M001 WHERE id_vehiculo = ? AND estado = "ACT"',
      [id]
    );
    
    if (vehiculo.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehículo no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: { kilometraje: vehiculo[0].kilometraje }
    });
  } catch (error) {
    console.error('Error getting vehiculo kilometraje:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el kilometraje del vehículo' 
    });
  }
});

// POST - Crear nueva hoja de salida (FLVEH_T001)
router.post('/hoja', auth, [
  body('id_cliente').notEmpty().isIn(['UBR', 'DYA']),
  body('id_piloto').notEmpty().isInt({ min: 1 }),
  body('id_vehiculo').notEmpty().isInt({ min: 1 }),
  body('placa_id').notEmpty().trim().escape(),
  body('lectura_km_num').notEmpty().isInt({ min: 0 }),
  body('observaciones').optional().trim().escape()
], async (req, res) => {
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
      id_cliente,
      id_piloto,
      id_vehiculo,
      placa_id,
      lectura_km_num,
      observaciones
    } = req.body;

    // Obtener el siguiente ID de hoja
    const [maxId] = await pool.execute(
      'SELECT COALESCE(MAX(id_hoja), 0) + 1 as next_id FROM FLVEHI.FLVEH_T001'
    );
    const id_hoja = maxId[0].next_id;

    // Insertar en FLVEH_T001 (maestro)
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_T001 (
        id_hoja, id_empresa, id_cliente, id_piloto, id_vehiculo, placa_id, 
        lectura_km_pic, lectura_km_txt, tipo_hoja, id_hoja_referencia, 
        lectura_km_num, tasa_kilometraje, vale_serie, vale_numero, 
        id_usuario, observaciones, fe_registro, fe_modificacion, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
      [
        id_hoja, 1, id_cliente, id_piloto, id_vehiculo, placa_id,
        '', '', 'S', 0, lectura_km_num, 0, 0, 0,
        req.user.id_usuario, observaciones || '', 'ACT'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Hoja de salida creada exitosamente',
      data: { id_hoja }
    });

  } catch (error) {
    console.error('Error creating hoja:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear la hoja de salida' 
    });
  }
});

// POST - Agregar item revisado (FLVEH_T002)
router.post('/item-revisado', auth, [
  body('id_hoja').notEmpty().isInt({ min: 1 }),
  body('id_check').notEmpty().isInt({ min: 1 }),
  body('anotacion').optional().trim().escape()
], async (req, res) => {
  try {
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id_hoja, id_check, anotacion } = req.body;

    // Insertar en FLVEH_T002 (detalle)
    await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_T002 (
        id_hoja, id_empresa, id_check, anotacion, id_usuario, 
        tiempo_inicio, tiempo_final, fe_registro, fe_modificacion, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
      [
        id_hoja, 1, id_check, anotacion || '', req.user.id_usuario,
        '', '', 'ACT'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Item revisado agregado exitosamente'
    });

  } catch (error) {
    console.error('Error adding item revisado:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al agregar el item revisado' 
    });
  }
});

// GET - Obtener hojas de salida existentes
router.get('/hojas', auth, async (req, res) => {
  try {
    const [hojas] = await pool.execute(
      `SELECT h.*, p.nombres, p.apellidos, v.placa_id, v.marca_vehiculo, v.modelo
       FROM FLVEHI.FLVEH_T001 h
       LEFT JOIN FLVEHI.FLVEH_M004 p ON h.id_piloto = p.id_piloto
       LEFT JOIN FLVEHI.FLVEH_M001 v ON h.id_vehiculo = v.id_vehiculo
       WHERE h.estado = "ACT"
       ORDER BY h.fe_registro DESC`
    );
    
    res.json({
      success: true,
      data: hojas,
      total: hojas.length
    });
  } catch (error) {
    console.error('Error getting hojas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener las hojas de salida' 
    });
  }
});

// GET - Obtener items revisados de una hoja específica
router.get('/hoja/:id/items', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [items] = await pool.execute(
      `SELECT i.*, c.desc_check
       FROM FLVEHI.FLVEH_T002 i
       LEFT JOIN FLVEHI.FLVEH_M007 c ON i.id_check = c.id_check
       WHERE i.id_hoja = ? AND i.estado = "ACT"
       ORDER BY i.fe_registro ASC`,
      [id]
    );
    
    res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error) {
    console.error('Error getting hoja items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los items de la hoja' 
    });
  }
});

module.exports = router;
