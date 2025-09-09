const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los check-master
router.get('/', auth, async (req, res) => {
  try {
    const [checkMaster] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M007 ORDER BY id_check DESC'
    );
    
    res.json({
      success: true,
      data: checkMaster,
      total: checkMaster.length
    });
  } catch (error) {
    console.error('Error getting check-master:', error);
    res.status(500).json({ 
      success: false, 
        error: 'Error al obtener los check-master' 
    });
  }
});

// GET - Listado sin autorizacion
router.get('/cat', async (req, res) => {
  try {
    const [catCheckMaster] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M007 ORDER BY id_check DESC'
    );
    res.send(catCheckMaster);
  } catch (error) {
    console.error('Error getting check-master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los check-master' 
    });
  }
});


// GET - Obtener un check-master por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [checkMaster] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [id]
    );
    
    if (checkMaster.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Check-master no encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: checkMaster[0]
    });
  } catch (error) {
    console.error('Error getting check-master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el check-master' 
    });
  }
});

// POST - Crear nueva check master
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('tipo_check').notEmpty().trim().escape(),
  body('desc_check').notEmpty().trim().escape(),
  body('id_piloto_default').notEmpty().isInt({ min: 1 }),
  body('tipo_vehiculo').notEmpty().isInt({ min: 1 }),
  body('cod_abreviado').notEmpty().trim().escape(),
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
      tipo_check,
      tipo_vehiculo,
      desc_check,
      id_piloto_default,
      cod_abreviado,
      estado,
      observaciones
    } = req.body;

    // Verificar si el check master ya existe por código abreviado
    const [existingCheckMaster] = await pool.execute(
      'SELECT id_check FROM FLVEHI.FLVEH_M007 WHERE id_empresa = ? AND cod_abreviado = ?',
      [id_empresa, cod_abreviado]
    );

    if (existingCheckMaster.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un check master con ese código'
      });
    }

    console.log('<<Entra antes del insert>>', req.body);
    
    // Insertar nuevo check master
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M007 (
        id_empresa, tipo_check, tipo_vehiculo, desc_check, id_piloto_default, cod_abreviado, observaciones, estado, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, 
        tipo_check,
        tipo_vehiculo || 1,
        desc_check,
        id_piloto_default || 1,
        cod_abreviado,
        observaciones,
        estado
      ]
    );

    // Obtener la check master creada
    const [newCheckMaster] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Check master creada exitosamente',
      data: newCheckMaster[0]
    });

  } catch (error) {
      console.error('Error al crear el check master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el check master' 
    });
  }
});

// PUT - Actualizar check master
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('tipo_check').notEmpty().trim().escape(),
  body('desc_check').notEmpty().trim().escape(),
  body('id_piloto_default').notEmpty().isInt({ min: 1 }),
  body('tipo_vehiculo').notEmpty().isInt({ min: 1 }),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('observaciones').optional().trim().escape(),
  body('estado').notEmpty().trim().escape()
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
      tipo_check,
      tipo_vehiculo,
      desc_check,
      id_piloto_default,
      cod_abreviado,
      observaciones,
      estado
    } = req.body;

    // Verificar si la check master ya existe con otro código abreviado
    const [existingCheckMaster] = await pool.execute(
        'SELECT id_check FROM FLVEHI.FLVEH_M007 WHERE cod_abreviado = ? AND id_check != ?',
      [cod_abreviado, id]
    );

    if (existingCheckMaster.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otro check master con ese código'
      });
    }

    // Verificar que la sede existe
    const [currentCheckMaster] = await pool.execute(
      'SELECT id_check FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [id]
    );

    if (currentCheckMaster.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Check master no encontrada'
      });
    }

    // Actualizar check master
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M007 SET 
        tipo_check = ?, tipo_vehiculo = ?, desc_check = ?, id_piloto_default = ?, cod_abreviado = ?, observaciones = ?, 
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_check = ?`,
      [
        tipo_check, tipo_vehiculo, desc_check, id_piloto_default, cod_abreviado, observaciones, id
      ]
    );

    // Obtener la check master actualizada
    const [updatedCheckMaster] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Check master actualizada exitosamente',
      data: updatedCheckMaster[0]
    });

  } catch (error) {
    console.error('Error updating check master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el check master' 
    });
  }
});

// DELETE - Eliminar Check Master
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la check master existe
    const [currentCheckMaster] = await pool.execute(
      'SELECT id_check FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [id]
    );

    if (currentCheckMaster.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Check master no encontrada'
      });
    }


    // Eliminar check master
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M007 WHERE id_check = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Check master eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting check master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el check master' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      desc_check,
      tipo_check
      //estado, 
      //tipo_vehiculo,
      //id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M007 WHERE 1=1';
    let params = [];


    if (desc_check) {
      query += ' AND desc_check LIKE ?';
      params.push(`%${desc_check}%`);
    }

    if (tipo_check) {
      query += ' AND tipo_check LIKE ?';
      params.push(`%${tipo_check}%`);
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

    query += ' ORDER BY id_check DESC';

    const [checkMaster] = await pool.execute(query, params);

    res.json({
      success: true,
      data: checkMaster,
      total: checkMaster.length
    });

  } catch (error) {
    console.error('Error searching check master:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar check master' 
    });
  }
});

module.exports = router;
