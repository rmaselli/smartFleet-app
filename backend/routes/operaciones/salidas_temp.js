const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todas las salidas
router.get('/', auth, async (req, res) => {
  try {
    const [salidas] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_T003 ORDER BY id_salida DESC'
    );
    
    res.json({
      success: true,
      data: salidas,
      total: salidas.length
    });
  } catch (error) {
    console.error('Error getting salidas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener las salidas' 
    });
  }
});

// GET - Listado sin autorizacion
router.get('/cat', async (req, res) => {
  try {
    const [catSalidas] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_T003 ORDER BY id_salida DESC'
    );
    res.send(catSalidas);
  } catch (error) {
    console.error('Error getting salidas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener las salidas' 
    });
  }
});

// GET - Obtener una salida por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [salidas] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [id]
    );
    
    if (salidas.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Salida no encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: salidas[0]
    });
  } catch (error) {
    console.error('Error getting salida:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener la salida' 
    });
  }
});

// POST - Crear nueva salida
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_vehiculo').notEmpty().isInt({ min: 1 }),
  body('id_piloto').notEmpty().isInt({ min: 1 }),
  body('fecha_salida').notEmpty().trim().escape(),
  body('hora_salida').notEmpty().trim().escape(),
  body('destino').notEmpty().trim().escape(),
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
      id_vehiculo,
      id_piloto,
      fecha_salida,
      hora_salida,
      destino,
      observaciones
    } = req.body;

    console.log('<<Entra antes del insert>>', req.body);
    
    // Insertar nueva salida
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_T003 (
        id_empresa, id_vehiculo, id_piloto, fecha_salida, hora_salida, destino, observaciones, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, 
        id_vehiculo, 
        id_piloto,
        fecha_salida,
        hora_salida,
        destino,
        observaciones
      ]
    );

    // Obtener la salida creada
    const [newSalida] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Salida creada exitosamente',
      data: newSalida[0]
    });

  } catch (error) {
    console.error('Error al crear la salida:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear la salida' 
    });
  }
});

// PUT - Actualizar salida
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_vehiculo').notEmpty().isInt({ min: 1 }),
  body('id_piloto').notEmpty().isInt({ min: 1 }),
  body('fecha_salida').notEmpty().trim().escape(),
  body('hora_salida').notEmpty().trim().escape(),
  body('destino').notEmpty().trim().escape(),
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
      id_vehiculo,
      id_piloto,
      fecha_salida,
      hora_salida,
      destino,
      observaciones
    } = req.body;

    // Verificar que la salida existe
    const [currentSalida] = await pool.execute(
      'SELECT id_salida FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [id]
    );

    if (currentSalida.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Salida no encontrada'
      });
    }

    // Actualizar salida
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_T003 SET 
        id_vehiculo = ?, id_piloto = ?, fecha_salida = ?, hora_salida = ?, destino = ?, observaciones = ?, 
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_salida = ?`,
      [
        id_vehiculo, id_piloto, fecha_salida, hora_salida, destino, observaciones, id
      ]
    );

    // Obtener la salida actualizada
    const [updatedSalida] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Salida actualizada exitosamente',
      data: updatedSalida[0]
    });

  } catch (error) {
    console.error('Error updating salida:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar la salida' 
    });
  }
});

// DELETE - Eliminar salida
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la salida existe
    const [currentSalida] = await pool.execute(
      'SELECT id_salida FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [id]
    );

    if (currentSalida.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Salida no encontrada'
      });
    }

    // Eliminar salida
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_T003 WHERE id_salida = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Salida eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting salida:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar la salida' 
    });
  }
});

module.exports = router;

