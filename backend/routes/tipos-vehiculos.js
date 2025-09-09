const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los pilotos
router.get('/', auth, async (req, res) => {
  try {
    const [tiposVehiculos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M002 ORDER BY id_tipo_vehiculo DESC'
    );
    
    res.json({
      success: true,
      data: tiposVehiculos,
      total: tiposVehiculos.length
    });
  } catch (error) {
    console.error('Error getting tipos de vehículos:', error);
    res.status(500).json({ 
      success: false, 
        error: 'Error al obtener los tipos de vehículos' 
    });
  }
});

// GET - Listado sin autorizacion
router.get('/cat', async (req, res) => {
  try {
    const [catTiposVehiculos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M002 ORDER BY id_tipo_vehiculo DESC'
    );
    res.send(catTiposVehiculos);
  } catch (error) {
    console.error('Error getting tipos de vehículos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los tipos de vehículos' 
    });
  }
});


// GET - Obtener un piloto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [tiposVehiculos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [id]
    );
    
      if (tiposVehiculos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tipo de vehículo no encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: tiposVehiculos[0]
    });
  } catch (error) {
    console.error('Error getting tipo de vehículo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el tipo de vehículo' 
    });
  }
});

// POST - Crear nuevo tipo de vehículo
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_tipo_vehiculo').optional().isInt({ min: 1 }),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('desc_tipo_vehiculo').notEmpty().trim().escape(),
  body('estado').notEmpty().trim().escape(),
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
      id_empresa,
      cod_vehiculo,
      cod_abreviado,
      desc_tipo_vehiculo,
      tipo_vehiculo,
      estado,
      observaciones
    } = req.body;

    // Verificar si el tipo de vehículo ya existe por código
    const [existingTiposVehiculos] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE cod_vehiculo = ?',
      [cod_vehiculo]
    );

      if (existingTiposVehiculos.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un tipo de vehículo con ese código'
      });
    }

    console.log('<<Entra antes del insert>>', req.body);
    
    // Insertar nuevo tipo de vehículo
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M002 (
        id_empresa, cod_vehiculo, cod_abreviado, desc_tipo_vehiculo, observaciones, estado, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, 
        cod_vehiculo, 
        cod_abreviado,
        desc_tipo_vehiculo, 
        observaciones,
        estado
      ]
    );

    // Obtener el tipo de vehículo creado
    const [newTiposVehiculos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Tipo de vehículo creado exitosamente',
      data: newTiposVehiculos[0]
    });

  } catch (error) {
    console.error('Error al crear el tipo de vehículo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el tipo de vehículo' 
    });
  }
});

// PUT - Actualizar tipo de vehículo
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_vehiculo').optional().isInt({ min: 1 }),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('desc_vehiculo').notEmpty().trim().escape(),
  body('tipo_vehiculo').notEmpty().trim().escape(),
  body('observaciones').optional().trim().escape()
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
      cod_vehiculo,
      cod_abreviado,
      desc_tipo_vehiculo,
      tipo_vehiculo,
      observaciones
    } = req.body;

    // Verificar si el tipo de vehículo ya existe con otro código
    const [existingTiposVehiculos] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE cod_vehiculo = ? AND id_tipo_vehiculo != ?',
      [cod_vehiculo, id]
    );

    if (existingTiposVehiculos.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otro tipo de vehículo con ese código'
      });
    }

    // Verificar que el tipo de vehículo existe
    const [currentTiposVehiculos] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [id]
    );

    if (currentTiposVehiculos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de vehículo no encontrada'
      });
    }

    // Actualizar tipo de vehículo
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M002 SET 
        cod_vehiculo = ?, cod_abreviado = ?, desc_tipo_vehiculo = ?,  observaciones = ?, 
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_tipo_vehiculo = ?`,
      [
        cod_vehiculo, cod_abreviado, desc_tipo_vehiculo, observaciones, id
      ]
    );

    // Obtener el tipo de vehículo actualizado
    const [updatedTiposVehiculos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Tipo de vehículo actualizada exitosamente',
      data: updatedTiposVehiculos[0]
    });

  } catch (error) {
    console.error('Error updating tipo de vehículo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el tipo de vehículo' 
    });
  }
});

// DELETE - Eliminar piloto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el tipo de vehículo existe
    const [currentTiposVehiculos] = await pool.execute(
      'SELECT id_tipo_vehiculo FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [id]
    );

    if (currentTiposVehiculos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de vehículo no encontrada'
      });
    }


    // Eliminar tipo de vehículo
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M002 WHERE id_tipo_vehiculo = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Tipo de vehículo eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting tipo de vehículo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el tipo de vehículo' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
        desc_tipo_vehiculo,
      tipo_vehiculo
      //estado, 
      //tipo_vehiculo,
      //id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M002 WHERE 1=1';
    let params = [];


    if (desc_tipo_vehiculo) {
      query += ' AND desc_tipo_vehiculo LIKE ?';
      params.push(`%${desc_tipo_vehiculo}%`);
    }

    if (tipo_vehiculo) {
      query += ' AND tipo_vehiculo LIKE ?';
      params.push(`%${tipo_vehiculo}%`);
    }

    //estado, tipo_vehiculo, id_empresa desactivados para esta pantalla
    //if (estado) {
    //  query += ' AND estado = ?';
    //  params.push(estado);
    //}

    //if (tipo_vehiculo) {
    //  query += ' AND tipo_vehiculo = ?';
    //  params.push(tipo_vehiculo);
    //}

    //if (id_empresa) {
    //  query += ' AND id_empresa = ?';
    //  params.push(id_empresa);
    //}

    query += ' ORDER BY id_tipo_vehiculo DESC';

    const [tiposVehiculos] = await pool.execute(query, params);

    res.json({
      success: true,
      data: tiposVehiculos,
      total: tiposVehiculos.length
    });

  } catch (error) {
    console.error('Error searching tipos de vehículos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar tipos de vehículos' 
    });
  }
});

module.exports = router;
