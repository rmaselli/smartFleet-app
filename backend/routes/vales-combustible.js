const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los vales de combustible
router.get('/', auth, async (req, res) => {
  try {
    const [valesCombustible] = await pool.execute(`
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      ORDER BY vc.id_vale DESC
    `);
    
    res.json({
      success: true,
      data: valesCombustible,
      total: valesCombustible.length
    });
  } catch (error) {
    console.error('Error getting vales de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los vales de combustible' 
    });
  }
});

// GET - Listado sin autorización
router.get('/cat', async (req, res) => {
  try {
    const [valesCombustible] = await pool.execute(`
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      ORDER BY vc.id_vale DESC
    `);
    res.send(valesCombustible);
  } catch (error) {
    console.error('Error getting vales de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los vales de combustible' 
    });
  }
});

// GET - Obtener un vale de combustible por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [valesCombustible] = await pool.execute(`
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      WHERE vc.id_vale = ?
    `, [id]);
    
    if (valesCombustible.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vale de combustible no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: valesCombustible[0]
    });
  } catch (error) {
    console.error('Error getting vale de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el vale de combustible' 
    });
  }
});

// POST - Crear nuevo vale de combustible
router.post('/', auth, [
  body('id_empresa').isInt({ min: 1 }).withMessage('La empresa es requerida'),
  body('id_sede_origen').optional().isInt({ min: 1 }),
  body('tipo_combustible').isIn(['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido', 'Gas Natural', 'Otro']).withMessage('El tipo de combustible debe ser válido'),
  body('proveedor').isLength({ max: 45 }).withMessage('El proveedor no puede exceder 45 caracteres'),
  body('fe_emision').isISO8601().withMessage('La fecha de emisión debe ser válida'),
  body('fe_validez').isISO8601().withMessage('La fecha de validez debe ser válida'),
  body('cod_barra').optional().isLength({ max: 50 }).withMessage('El código de barras no puede exceder 50 caracteres'),
  body('cupon').isInt({ min: 1 }).withMessage('El cupón es requerido y debe ser un número entero'),
  body('codigo').isInt({ min: 1 }).withMessage('El código es requerido y debe ser un número entero'),
  body('valor_vale').isFloat({ min: 0 }).withMessage('El valor del vale es requerido y debe ser mayor o igual a 0'),
  body('observaciones').optional().isLength({ max: 100 }).withMessage('Las observaciones no pueden exceder 100 caracteres'),
  body('estado').isIn(['ACT', 'INA', 'APR', 'AUT', 'REC']).withMessage('El estado debe ser válido')
], async (req, res) => {
  try {
    // Log detallado para debugging
    console.log('🔍 POST /api/vales-combustible');
    console.log('📤 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📋 Request headers:', req.headers);
    
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      id_empresa,
      id_sede_origen,
      tipo_combustible,
      proveedor,
      fe_emision,
      fe_validez,
      cod_barra,
      cupon,
      codigo,
      valor_vale,
      observaciones,
      estado
    } = req.body;

    // Insertar nuevo vale de combustible
    console.log('🔍 Insertando nuevo vale de combustible...');
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M010 (
        id_empresa, id_sede_origen, id_hoja_salida, tipo_combustible, proveedor, 
        fe_emision, fe_validez, cod_barra, cupon, codigo, valor_vale, 
        id_autoriza, observaciones, estado, fe_registro, fe_modificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa,
        id_sede_origen || 1,
        0, // id_hoja_salida
        tipo_combustible,
        proveedor,
        fe_emision,
        fe_validez,
        cod_barra || null,
        cupon,
        codigo,
        valor_vale,
        0, // id_autoriza
        observaciones || null,
        estado
      ]
    );

    // Obtener el vale de combustible creado
    const [newValeCombustible] = await pool.execute(`
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      WHERE vc.id_vale = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Vale de combustible creado exitosamente',
      data: newValeCombustible[0]
    });

  } catch (error) {
    console.error('❌ Error al crear el vale de combustible:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el vale de combustible',
      details: error.message
    });
  }
});

// PUT - Actualizar vale de combustible
router.put('/:id', auth, [
  body('id_empresa').isInt({ min: 1 }).withMessage('La empresa es requerida'),
  body('id_sede_origen').optional().isInt({ min: 1 }),
  body('tipo_combustible').isIn(['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido', 'Gas Natural', 'Otro']).withMessage('El tipo de combustible debe ser válido'),
  body('proveedor').isLength({ max: 45 }).withMessage('El proveedor no puede exceder 45 caracteres'),
  body('fe_emision').isISO8601().withMessage('La fecha de emisión debe ser válida'),
  body('fe_validez').isISO8601().withMessage('La fecha de validez debe ser válida'),
  body('cod_barra').optional().isLength({ max: 50 }).withMessage('El código de barras no puede exceder 50 caracteres'),
  body('cupon').isInt({ min: 1 }).withMessage('El cupón es requerido y debe ser un número entero'),
  body('codigo').isInt({ min: 1 }).withMessage('El código es requerido y debe ser un número entero'),
  body('valor_vale').isFloat({ min: 0 }).withMessage('El valor del vale es requerido y debe ser mayor o igual a 0'),
  body('observaciones').optional().isLength({ max: 100 }).withMessage('Las observaciones no pueden exceder 100 caracteres'),
  body('estado').isIn(['ACT', 'INA', 'APR', 'AUT', 'REC']).withMessage('El estado debe ser válido')
], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Log detallado para debugging
    console.log('🔍 PUT /api/vales-combustible/' + id);
    console.log('📤 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      id_empresa,
      id_sede_origen,
      tipo_combustible,
      proveedor,
      fe_emision,
      fe_validez,
      cod_barra,
      cupon,
      codigo,
      valor_vale,
      observaciones,
      estado
    } = req.body;

    // Verificar que el vale de combustible existe
    const [currentVale] = await pool.execute(
      'SELECT id_vale FROM FLVEHI.FLVEH_M010 WHERE id_vale = ?',
      [id]
    );

    if (currentVale.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vale de combustible no encontrado'
      });
    }

    // Actualizar vale de combustible
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M010 SET 
        id_empresa = ?, id_sede_origen = ?, tipo_combustible = ?, proveedor = ?, 
        fe_emision = ?, fe_validez = ?, cod_barra = ?, cupon = ?, codigo = ?, 
        valor_vale = ?, observaciones = ?, estado = ?, fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_vale = ?`,
      [
        id_empresa,
        id_sede_origen || 1,
        tipo_combustible,
        proveedor,
        fe_emision,
        fe_validez,
        cod_barra || null,
        cupon,
        codigo,
        valor_vale,
        observaciones || null,
        estado,
        id
      ]
    );

    // Obtener el vale de combustible actualizado
    const [updatedVale] = await pool.execute(`
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      WHERE vc.id_vale = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Vale de combustible actualizado exitosamente',
      data: updatedVale[0]
    });

  } catch (error) {
    console.error('Error updating vale de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el vale de combustible' 
    });
  }
});

// DELETE - Eliminar vale de combustible
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el vale de combustible existe
    const [currentVale] = await pool.execute(
      'SELECT id_vale FROM FLVEHI.FLVEH_M010 WHERE id_vale = ?',
      [id]
    );

    if (currentVale.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vale de combustible no encontrado'
      });
    }

    // Eliminar vale de combustible
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M010 WHERE id_vale = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Vale de combustible eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting vale de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el vale de combustible' 
    });
  }
});

// GET - Buscar vales de combustible por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      proveedor,
      tipo_combustible,
      estado
    } = req.query;

    let query = `
      SELECT 
        vc.*,
        u.nombre as autoriza_nombre
      FROM FLVEHI.FLVEH_M010 vc
      LEFT JOIN FLVEHI.FLVEH_S002 u ON vc.id_autoriza = u.id_usuario
      WHERE 1=1
    `;
    let params = [];

    if (proveedor) {
      query += ' AND vc.proveedor LIKE ?';
      params.push(`%${proveedor}%`);
    }

    if (tipo_combustible) {
      query += ' AND vc.tipo_combustible = ?';
      params.push(tipo_combustible);
    }

    if (estado) {
      query += ' AND vc.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY vc.id_vale DESC';

    const [valesCombustible] = await pool.execute(query, params);

    res.json({
      success: true,
      data: valesCombustible,
      total: valesCombustible.length
    });

  } catch (error) {
    console.error('Error searching vales de combustible:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar vales de combustible' 
    });
  }
});

module.exports = router;
