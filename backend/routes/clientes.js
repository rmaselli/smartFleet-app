const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los clientes
router.get('/', auth, async (req, res) => {
  try {
    const [clientes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M005 ORDER BY id_cliente DESC'
    );
    
    res.json({
      success: true,
      data: clientes,
      total: clientes.length
    });
  } catch (error) {
    console.error('Error getting clientes:', error);
    res.status(500).json({ 
      success: false, 
        error: 'Error al obtener los clientes' 
    });
  }
});

// GET - Listado sin autorizacion
router.get('/cat', async (req, res) => {
  try {
    const [catClientes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M005 ORDER BY id_cliente DESC'
    );
    res.send(catClientes);
  } catch (error) {
    console.error('Error getting clientes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los clientes' 
    });
  }
});


// GET - Obtener un cliente por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [clientes] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [id]
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Cliente no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: clientes[0]
    });
  } catch (error) {
    console.error('Error getting cliente:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el cliente' 
    });
  }
});

// POST - Crear nuevo cliente
router.post('/', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_cliente').notEmpty().trim().escape(),
  body('cod_alterno').notEmpty().trim().escape(),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('tipo_cliente').notEmpty().trim().escape(),
  body('nombre').notEmpty().trim().escape(),
  body('razon_social').notEmpty().trim().escape(),
  body('nit').notEmpty().trim().escape(),
  body('direccion').notEmpty().trim().escape(),
  body('email').notEmpty().trim().escape(),
  body('telefono').notEmpty().trim().escape(),
  body('contacto1').notEmpty().trim().escape(),
  body('contacto2').notEmpty().trim().escape(),
  body('tel_contacto1').notEmpty().trim().escape(),
  body('tel_contacto2').notEmpty().trim().escape(),
  body('estado').optional().trim().escape(),
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
      cod_cliente,
      cod_alterno,
      cod_abreviado,
      tipo_cliente,
      nombre,
      razon_social,
      nit,
      direccion,
      email,
      telefono,
      contacto1,
      contacto2,
      tel_contacto1,
      tel_contacto2,
      estado="ACT",
      observaciones
    } = req.body;

    // Verificar si el cliente ya existe por código
    const [existingClientes] = await pool.execute(
      'SELECT id_cliente FROM FLVEHI.FLVEH_M005 WHERE cod_cliente = ?',
      [cod_cliente]
    );

    if (existingClientes.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un cliente con ese código'
      });
    }

    console.log('<<Entra antes del insert>>', req.body);
    
    // Insertar nuevo cliente
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.FLVEH_M005 (
          id_empresa, cod_cliente, cod_alterno, cod_abreviado, tipo_cliente, nombre, razon_social, nit, direccion, email, telefono, contacto1, contacto2, tel_contacto1, tel_contacto2, estado, observaciones, fe_registro, fe_modificacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id_empresa || 1, 
        cod_cliente, 
        cod_alterno, 
        cod_abreviado, 
        tipo_cliente, 
        nombre, 
        razon_social, 
        nit, 
        direccion, 
        email, 
        telefono, 
        contacto1, 
        contacto2, 
        tel_contacto1, 
        tel_contacto2, 
        estado, 
        observaciones
      ]
    );

    // Obtener el cliente creado
    const [newCliente] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: newCliente[0]
    });

  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear el cliente' 
    });
  }
});

// PUT - Actualizar cliente
router.put('/:id', auth, [
  body('id_empresa').optional().isInt({ min: 1 }),
  body('cod_cliente').notEmpty().trim().escape(),
  body('cod_alterno').notEmpty().trim().escape(),
  body('cod_abreviado').notEmpty().trim().escape(),
  body('tipo_cliente').notEmpty().trim().escape(),
  body('nombre').notEmpty().trim().escape(),
  body('razon_social').notEmpty().trim().escape(),
  body('nit').notEmpty().trim().escape(),
  body('direccion').notEmpty().trim().escape(),
  body('email').notEmpty().trim().escape(),
  body('telefono').notEmpty().trim().escape(),
  body('contacto1').notEmpty().trim().escape(),
  body('contacto2').notEmpty().trim().escape(),
  body('tel_contacto1').notEmpty().trim().escape(),
  body('tel_contacto2').notEmpty().trim().escape(),
  body('estado').optional().trim().escape(),
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
      cod_cliente,
      cod_alterno,
      cod_abreviado,
      tipo_cliente,
      nombre,
      razon_social,
      nit,
      direccion,
      email,
      telefono,
      contacto1,
      contacto2,
      tel_contacto1,
      tel_contacto2,
      estado,
      observaciones,
      fe_registro,
      fe_modificacion
    } = req.body;

    // Verificar si el cliente ya existe con otro código
    const [existingClientes] = await pool.execute(
      'SELECT id_cliente FROM FLVEHI.FLVEH_M005 WHERE cod_cliente = ? AND id_cliente != ?',
      [cod_cliente, id]
    );

    if (existingClientes.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe otro cliente con ese código'
      });
    }

    // Verificar que el cliente existe
    const [currentCliente] = await pool.execute(
      'SELECT id_cliente FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [id]
    );

    if (currentCliente.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    // Actualizar cliente
    await pool.execute(
      `UPDATE FLVEHI.FLVEH_M005 SET 
        cod_cliente = ?, cod_alterno = ?, cod_abreviado = ?, tipo_cliente = ?, nombre = ?, razon_social = ?, nit = ?, direccion = ?, email = ?, telefono = ?, contacto1 = ?, contacto2 = ?, tel_contacto1 = ?, tel_contacto2 = ?, estado = ?, observaciones = ?,
        fe_modificacion = CURRENT_TIMESTAMP
      WHERE id_cliente = ?`,
      [
        cod_cliente, cod_alterno, cod_abreviado, tipo_cliente, nombre, razon_social, nit, direccion, email, telefono, contacto1, contacto2, tel_contacto1, tel_contacto2, estado, observaciones, id
      ]
    );

    // Obtener el cliente actualizado
    const [updatedCliente] = await pool.execute(
      'SELECT * FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: updatedCliente[0]
    });

  } catch (error) {
    console.error('Error updating cliente:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar el cliente' 
    });
  }
});

  // DELETE - Eliminar cliente
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el cliente existe
    const [currentCliente] = await pool.execute(
      'SELECT id_cliente FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [id]
    );

    if (currentCliente.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }


    // Eliminar cliente
    await pool.execute(
      'DELETE FROM FLVEHI.FLVEH_M005 WHERE id_cliente = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting cliente:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar el cliente' 
    });
  }
});

// GET - Buscar vehículos por filtros
router.get('/search/filters', auth, async (req, res) => {
  try {
    const { 
      nombre, 
      razon_social
      //estado, 
      //tipo_vehiculo,
      //id_empresa 
    } = req.query;

    let query = 'SELECT * FROM FLVEHI.FLVEH_M005 WHERE 1=1';
    let params = [];

    if (nombre) {
      query += ' AND nombre LIKE ?';
      params.push(`%${nombre}%`);
    }

    if (razon_social) {
      query += ' AND razon_social LIKE ?';
      params.push(`%${razon_social}%`);
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

    query += ' ORDER BY cod_cliente DESC';

    const [clientes] = await pool.execute(query, params);

    res.json({
      success: true,
      data: clientes,
      total: clientes.length
    });

  } catch (error) {
    console.error('Error searching clientes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al buscar clientes' 
    });
  }
});

module.exports = router;
