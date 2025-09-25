const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los repuestos
router.get('/', auth, async (req, res) => {
  try {
    const [repuestos] = await pool.execute(`
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      ORDER BY r.id_repuesto DESC
    `);
    
    res.json({
      success: true,
      data: repuestos,
      total: repuestos.length
    });
  } catch (error) {
    console.error('Error getting repuestos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los repuestos' 
    });
  }
});

// GET - Listado sin autorización
router.get('/cat', async (req, res) => {
  try {
    const [repuestos] = await pool.execute(`
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      ORDER BY r.id_repuesto DESC
    `);
    res.send(repuestos);
  } catch (error) {
    console.error('Error getting repuestos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los repuestos' 
    });
  }
});

// GET - Obtener un repuesto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [repuestos] = await pool.execute(`
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      WHERE r.id_repuesto = ?
    `, [id]);
    
    if (repuestos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Repuesto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: repuestos[0]
    });
  } catch (error) {
    console.error('Error getting repuesto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el repuesto' 
    });
  }
});

// POST - Crear nuevo repuesto
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_sede').optional().isInt({ min: 1 }),
  body('tipo_vehiculo').isInt({ min: 1 }).withMessage('El tipo de vehículo es requerido'),
  body('referencia').optional().isLength({ max: 20 }).withMessage('La referencia no puede exceder 20 caracteres'),
  body('cod_barras').optional().isLength({ max: 20 }).withMessage('El código de barras no puede exceder 20 caracteres'),
  body('descripcion').optional().isLength({ max: 50 }).withMessage('La descripción no puede exceder 50 caracteres'),
  body('unidad_medida').optional().trim().escape(),
  body('punto_reorden').isNumeric().withMessage('El punto de reorden es requerido y debe ser un número'),
  body('anotaciones').optional().isLength({ max: 100 }).withMessage('Las anotaciones no pueden exceder 100 caracteres'),
  body('estatus').isIn(['ACT', 'INA', 'OBS']).withMessage('El estatus debe ser ACT, INA u OBS')
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

    // Validación adicional para punto de reorden
    if (req.body.punto_reorden && parseFloat(req.body.punto_reorden) < 0) {
      return res.status(400).json({
        success: false,
        error: 'El punto de reorden debe ser mayor o igual a 0'
      });
    }

    const {
      id_empresa,
      id_sede,
      tipo_vehiculo,
      referencia,
      cod_barras,
      descripcion,
      unidad_medida,
      punto_reorden,
      anotaciones,
      estatus
    } = req.body;

    // Verificar que el tipo de vehículo existe
    const [tipoVehiculoExists] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [tipo_vehiculo]
    );

    if (tipoVehiculoExists.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El tipo de vehículo seleccionado no existe'
      });
    }

    // Insertar nuevo repuesto
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M008 (
        id_empresa, id_sede, tipo_vehiculo, referencia, cod_barras, descripcion, 
        unidad_medida, punto_reorden, anotaciones, estatus, fe_registro, fe_modificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1,
        id_sede || 1,
        tipo_vehiculo,
        referencia || null,
        cod_barras || null,
        descripcion || null,
        unidad_medida || null,
        parseFloat(punto_reorden),
        anotaciones || null,
        estatus
      ]
    );

    // Obtener el repuesto creado
    const [newRepuesto] = await pool.execute(`
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      WHERE r.id_repuesto = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Repuesto creado exitosamente',
      data: newRepuesto[0]
    });

  } catch (error) {
    console.error('Error al crear el repuesto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el repuesto' 
    });
  }
});

// PUT - Actualizar repuesto
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_sede').optional().isInt({ min: 1 }),
  body('tipo_vehiculo').isInt({ min: 1 }).withMessage('El tipo de vehículo es requerido'),
  body('referencia').optional().isLength({ max: 20 }).withMessage('La referencia no puede exceder 20 caracteres'),
  body('cod_barras').optional().isLength({ max: 20 }).withMessage('El código de barras no puede exceder 20 caracteres'),
  body('descripcion').optional().isLength({ max: 50 }).withMessage('La descripción no puede exceder 50 caracteres'),
  body('unidad_medida').optional().trim().escape(),
  body('punto_reorden').isNumeric().withMessage('El punto de reorden es requerido y debe ser un número'),
  body('anotaciones').optional().isLength({ max: 100 }).withMessage('Las anotaciones no pueden exceder 100 caracteres'),
  body('estatus').isIn(['ACT', 'INA', 'OBS']).withMessage('El estatus debe ser ACT, INA u OBS')
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

    // Validación adicional para punto de reorden
    if (req.body.punto_reorden && parseFloat(req.body.punto_reorden) < 0) {
      return res.status(400).json({
        success: false,
        error: 'El punto de reorden debe ser mayor o igual a 0'
      });
    }

    const {
      id_empresa,
      id_sede,
      tipo_vehiculo,
      referencia,
      cod_barras,
      descripcion,
      unidad_medida,
      punto_reorden,
      anotaciones,
      estatus
    } = req.body;

    // Verificar que el tipo de vehículo existe
    const [tipoVehiculoExists] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [tipo_vehiculo]
    );

    if (tipoVehiculoExists.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El tipo de vehículo seleccionado no existe'
      });
    }

    // Verificar que el repuesto existe
    const [currentRepuesto] = await pool.execute(
      'SELECT id_repuesto FROM FLVEHI.FLVEH_M008 WHERE id_repuesto = ?',
      [id]
    );

    if (currentRepuesto.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Repuesto no encontrado'
      });
    }

    // Actualizar repuesto
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M008 SET 
        id_empresa = ?, id_sede = ?, tipo_vehiculo = ?, referencia = ?, cod_barras = ?, 
        descripcion = ?, unidad_medida = ?, punto_reorden = ?, anotaciones = ?, 
        estatus = ?, fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_repuesto = ?`,
      [
        id_empresa || 1,
        id_sede || 1,
        tipo_vehiculo,
        referencia || null,
        cod_barras || null,
        descripcion || null,
        unidad_medida || null,
        parseFloat(punto_reorden),
        anotaciones || null,
        estatus,
        id
      ]
    );

    // Obtener el repuesto actualizado
    const [updatedRepuesto] = await pool.execute(`
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      WHERE r.id_repuesto = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Repuesto actualizado exitosamente',
      data: updatedRepuesto[0]
    });

  } catch (error) {
    console.error('Error updating repuesto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el repuesto' 
    });
  }
});

// DELETE - Eliminar repuesto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el repuesto existe
    const [currentRepuesto] = await pool.execute(
      'SELECT id_repuesto FROM FLVEHI.FLVEH_M008 WHERE id_repuesto = ?',
      [id]
    );

    if (currentRepuesto.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Repuesto no encontrado'
      });
    }

    // Eliminar repuesto
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M008 WHERE id_repuesto = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Repuesto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting repuesto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el repuesto' 
    });
  }
});

// GET - Buscar repuestos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      descripcion,
      tipo_vehiculo,
      estatus
    } = req.query;

    let query = `
      SELECT 
        r.*,
        tv.cod_abreviado,
        tv.desc_tipo_vehiculo,
        CONCAT(tv.cod_abreviado, '-', tv.desc_tipo_vehiculo) as tipo_vehiculo_display
      FROM FLVEHI.FLVEH_M008 r
      LEFT JOIN FLVEHI.FLVEH_M002 tv ON r.tipo_vehiculo = tv.id_tipo_vehiculo
      WHERE 1=1
    `;
    let params = [];

    if (descripcion) {
      query += ' AND r.descripcion LIKE ?';
      params.push(`%${descripcion}%`);
    }

    if (tipo_vehiculo) {
      query += ' AND r.tipo_vehiculo = ?';
      params.push(tipo_vehiculo);
    }

    if (estatus) {
      query += ' AND r.estatus = ?';
      params.push(estatus);
    }

    query += ' ORDER BY r.id_repuesto DESC';

    const [repuestos] = await pool.execute(query, params);

    res.json({
      success: true,
      data: repuestos,
      total: repuestos.length
    });

  } catch (error) {
    console.error('Error searching repuestos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar repuestos' 
    });
  }
});

module.exports = router;
