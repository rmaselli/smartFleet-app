const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los pilotos
router.get('/', auth, async (req, res) => {
  try {
    const [sedes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M006 ORDER BY id_sede DESC'
    );
    
    res.json({
      success: true,
      data: sedes,
      total: sedes.length
    });
  } catch (error) {
    console.error('Error getting sedes:', error);
    res.status(500).json({ 
      success: false, 
        error: 'Error al obtener las sedes' 
    });
  }
});

// GET - Listado sin autorizacion
router.get('/cat', async (req, res) => {
  try {
    const [catSedes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M006 ORDER BY id_sede DESC'
    );
    res.send(catSedes);
  } catch (error) {
    console.error('Error getting sedes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener las sedes' 
    });
  }
});


// GET - Obtener un piloto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [sedes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [id]
    );
    
    if (sedes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Sede no encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: sedes[0]
    });
  } catch (error) {
    console.error('Error getting sede:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener la sede' 
    });
  }
});

// POST - Crear nueva sede
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_sede').notEmpty().trim().escape(),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('desc_sede').notEmpty().trim().escape(),
  body('tipo_sede').notEmpty().trim().escape(),
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
      cod_sede,
      cod_abreviado,
      desc_sede,
      tipo_sede,
      observaciones
    } = req.body;

    // Verificar si la sede ya existe por código
    const [existingSedes] = await pool.execute(
      'SELECT id_sede FROM FLVEHI.FLVEH_M006 WHERE cod_sede = ?',
      [cod_sede]
    );

    if (existingSedes.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una sede con ese código'
      });
    }

    console.log('<<Entra antes del insert>>', req.body);
    
    // Insertar nueva sede
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M006 (
        id_empresa, cod_sede, cod_abreviado, desc_sede, tipo_sede, observaciones, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, 
        cod_sede, 
        cod_abreviado,
        desc_sede, 
        tipo_sede, 
        observaciones
      ]
    );

    // Obtener la sede creada
    const [newSede] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Sede creada exitosamente',
      data: newSede[0]
    });

  } catch (error) {
    console.error('Error al crear la sede:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear la sede' 
    });
  }
});

// PUT - Actualizar sede
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_sede').notEmpty().trim().escape(),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('desc_sede').notEmpty().trim().escape(),
  body('tipo_sede').notEmpty().trim().escape(),
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
      cod_sede,
      cod_abreviado,
      desc_sede,
      tipo_sede,
      observaciones
    } = req.body;

    // Verificar si la sede ya existe con otro código
    const [existingSedes] = await pool.execute(
      'SELECT id_sede FROM FLVEHI.FLVEH_M006 WHERE cod_sede = ? AND id_sede != ?',
      [cod_sede, id]
    );

    if (existingSedes.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otra sede con ese código'
      });
    }

    // Verificar que la sede existe
    const [currentSede] = await pool.execute(
      'SELECT id_sede FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [id]
    );

    if (currentSede.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sede no encontrada'
      });
    }

    // Actualizar sede
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M006 SET 
        cod_sede = ?, cod_abreviado = ?, desc_sede = ?, tipo_sede = ?, observaciones = ?, 
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_sede = ?`,
      [
        cod_sede, cod_abreviado, desc_sede, tipo_sede, observaciones, id
      ]
    );

    // Obtener la sede actualizada
    const [updatedSede] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Sede actualizada exitosamente',
      data: updatedSede[0]
    });

  } catch (error) {
    console.error('Error updating sede:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar la sede' 
    });
  }
});

// DELETE - Eliminar piloto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la sede existe
    const [currentSede] = await pool.execute(
      'SELECT id_sede FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [id]
    );

    if (currentSede.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sede no encontrada'
      });
    }


    // Eliminar sede
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M006 WHERE id_sede = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Sede eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting sede:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar la sede' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      desc_sede,
      tipo_sede
      //estado, 
      //tipo_vehiculo,
      //id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M006 WHERE 1=1';
    let params = [];


    if (desc_sede) {
      query += ' AND desc_sede LIKE ?';
      params.push(`%${desc_sede}%`);
    }

    if (tipo_sede) {
      query += ' AND tipo_sede LIKE ?';
      params.push(`%${tipo_sede}%`);
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

    query += ' ORDER BY id_sede DESC';

    const [sedes] = await pool.execute(query, params);

    res.json({
      success: true,
      data: sedes,
      total: sedes.length
    });

  } catch (error) {
    console.error('Error searching sedes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar sedes' 
    });
  }
});

module.exports = router;
