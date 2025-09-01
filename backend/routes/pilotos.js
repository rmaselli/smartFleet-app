const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los vehículos
router.get('/', auth, async (req, res) => {
  try {
    const [pilotos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M004 ORDER BY id_piloto DESC'
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

// GET - Obtener un vehículo por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [pilotos] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id]
    );
    
    if (pilotos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Piloto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: pilotos[0]
    });
  } catch (error) {
    console.error('Error getting piloto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el piloto' 
    });
  }
});

// POST - Crear nuevo piloto
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('id_sede').optional().isInt({ min: 1 }),
  body('nombres').notEmpty().trim().escape(),
  body('apellidos').notEmpty().trim().escape(),
  body('fe_nacimiento').notEmpty().trim().escape(),
  body('direccion').notEmpty().trim().escape(),
  body('telefono').notEmpty().trim().escape(),
  body('num_dpi').notEmpty().trim().escape(),
  body('fe_vence_dpi').notEmpty().trim().escape(),
  body('num_licencia').notEmpty().trim().escape(),
  body('fe_vence_licencia').notEmpty().trim().escape(),
  body('viajes').notEmpty().trim().escape(),
  body('estado').notEmpty().trim().escape(),
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
      nombres,
      apellidos,
      fe_nacimiento,
      direccion,
      telefono,
      num_dpi,
      fe_vence_dpi,
      num_licencia,
      fe_vence_licencia,
      viajes,
      estado,
      observaciones
    } = req.body;
 

    // Verificar si el piloto ya existe
    const [existingPilotos] = await pool.execute(
      'SELECT id_piloto FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id_piloto]
    );

    if (existingPilotos.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un piloto con ese ID'
      });
    }

    // Insertar nuevo piloto
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M004 (
        id_empresa, id_sede, nombres, apellidos, fe_nacimiento, direccion, telefono, num_dpi, fe_vence_dpi, num_licencia, fe_vence_licencia, viajes, estado, fe_registro, observaciones, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, id_sede || 1,  nombres, apellidos, fe_nacimiento, direccion, telefono, num_dpi, fe_vence_dpi, num_licencia, fe_vence_licencia, viajes, estado, fe_registro, fe_modificacion
      ]
    );

    // Obtener el vehículo creado
    const [newPiloto] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: newPiloto[0]
    });

  } catch (error) {
    console.error('Error al crear el piloto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el piloto' 
    });
  }
});

// PUT - Actualizar vehículo
router.put('/:id', auth, [
  body('id_empresa').notEmpty().trim().escape(),
  body('id_sede').notEmpty().trim().escape(),
  body('nombres').notEmpty().trim().escape(),
  body('apellidos').notEmpty().trim().escape(),
  body('fe_nacimiento').notEmpty().trim().escape(),
  body('direccion').notEmpty().trim().escape(),
  body('telefono').notEmpty().trim().escape(),
  body('num_dpi').notEmpty().trim().escape(),
  body('fe_vence_dpi').notEmpty().trim().escape(),
  body('num_licencia').notEmpty().trim().escape(),
  body('fe_vence_licencia').notEmpty().trim().escape(),
  body('viajes').notEmpty().trim().escape(),
  body('estado').notEmpty().trim().escape(),
  body('observaciones').notEmpty().trim().escape(),
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
      id_piloto,  
      nombres,
      apellidos,
      fe_nacimiento,
      direccion,
      telefono,
      num_dpi,
      fe_vence_dpi,
      num_licencia,
      fe_vence_licencia,
      viajes,
      estado,
      observaciones,
      fe_modificacion
    } = req.body;

    // Verificar si el piloto ya existe en otro vehículo
    const [existingPilotos] = await pool.execute(
      'SELECT id_piloto FROM FLVEHI.FLVEH_M001 WHERE id_piloto = ? AND id_piloto != ?',
      [id_piloto, id]
    );

    if (existingPilotos.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otro piloto con ese ID'
      });
    }

    // Verificar que el piloto existe
    const [currentPiloto] = await pool.execute(
      'SELECT id_piloto FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id]
    );

    if (currentPiloto.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Piloto no encontrado'
      });
    }

    // Actualizar piloto
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M004 SET 
        nombres = ?, apellidos = ?, fe_nacimiento = ?, direccion = ?, telefono = ?, num_dpi = ?, fe_vence_dpi = ?, num_licencia = ?, fe_vence_licencia = ?, viajes = ?, estado = ?, observaciones = ?, 
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_piloto = ? AND id_empresa = ? AND id_sede = ?`,
      [
        nombres, apellidos, fe_nacimiento, direccion, telefono, num_dpi, fe_vence_dpi, num_licencia, fe_vence_licencia, viajes, estado, observaciones, id, id_empresa, id_sede
      ]
    );

    // Obtener el piloto actualizado
    const [updatedPiloto] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Piloto actualizado exitosamente',
      data: updatedPiloto[0]
    });

  } catch (error) {
    console.error('Error updating piloto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el piloto' 
    });
  }
});

// DELETE - Eliminar piloto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el piloto existe
    const [currentPiloto] = await pool.execute(
      'SELECT id_piloto FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id]
    );

    if (currentPiloto.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Piloto no encontrado'
      });
    }


    // Eliminar piloto
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M004 WHERE id_piloto = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Piloto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting piloto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el piloto' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      id_piloto, 
      nombres, 
      apellidos
      //estado, 
      //tipo_vehiculo,
      //id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M004 WHERE 1=1';
    let params = [];

    if (id_piloto) {
      query += ' AND id_piloto LIKE ?';
      params.push(`%${id_piloto}%`);
    }

    if (nombres) {
      query += ' AND nombres LIKE ?';
      params.push(`%${nombres}%`);
    }

    if (apellidos) {
      query += ' AND apellidos LIKE ?';
      params.push(`%${apellidos}%`);
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

    query += ' ORDER BY id_piloto DESC';

    const [pilotos] = await pool.execute(query, params);

    res.json({
      success: true,
      data: pilotos,
      total: pilotos.length
    });

  } catch (error) {
    console.error('Error searching pilotos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar pilotos' 
    });
  }
});

module.exports = router;
