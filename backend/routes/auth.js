const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty().trim().escape(),
  body('phone').optional().isLength({ min: 7 }).trim().escape(),
  body('department').optional().trim().escape(),
  body('company_id').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, full_name, phone, department, company_id } = req.body;

    // Check if user already exists in flveh_s002 table
    const [existingUsers] = await pool.execute(
      'SELECT id_empresa FROM FLVEHI.flveh_s002 WHERE usuario = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into flveh_s002 table
    const [result] = await pool.execute(
      `INSERT INTO FLVEHI.flveh_s002 (
        id_empresa,
        id_usuario,
        nombre,
        usuario,
        email,
        pass,
        token,
        ultimo_acceso,
        fe_registro,
        estatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ACT')`,
      [company_id || 1, null, full_name, username, email, hashedPassword, 'temp_token']
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertId,
        username: username,
        role: 'user'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    res.status(201).json({
      message: 'User registered successfully in FLVEHI system',
      token,
      user: {
        id: result.insertId,
        username,
        email,
        full_name,
        phone,
        department,
        company_id,
        role: 'user',
        status: 'ACT'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', [
  body('username').notEmpty().trim(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username or email in flveh_s002 table
    const [users] = await pool.execute(
      'SELECT * FROM FLVEHI.flveh_s002 WHERE (usuario = ? OR email = ?) AND estatus = "ACT"',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or account inactive' });
    }

    const user = users[0];

    // Check password - usando el campo 'pass' en lugar de 'password'
    const isValidPassword = await bcrypt.compare(password, user.pass);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login - usando 'ultimo_acceso' en lugar de 'last_login'
    await pool.execute(
      'UPDATE FLVEHI.flveh_s002 SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_empresa = ?',
      [user.id_empresa]
    );

    // Generate JWT token with optimized payload
    const token = jwt.sign(
      { 
        userId: user.id_empresa,
        username: user.usuario,
        role: user.role || 'user'
        // Solo información esencial para reducir tamaño del token
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: '24h',
        algorithm: 'HS256' // Usar algoritmo más eficiente
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id_empresa,
        username: user.usuario,
        email: user.email,
        full_name: user.nombre || user.usuario,
        phone: user.phone || null,
        department: user.department || null,
        company_id: user.id_empresa,
       // role: user.role || 'user',
        status: user.estatus
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Get user from flveh_s002 table
    const [users] = await pool.execute(
      'SELECT id_empresa, usuario, email, nombre, estatus, ultimo_acceso, fe_registro FROM FLVEHI.flveh_s002 WHERE id_empresa = ?',
      [req.user.id_empresa]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    res.json({
      user: {
        id: user.id_empresa,
        username: user.usuario,
        email: user.email,
        full_name: user.nombre,
        phone: null,
        department: null,
        company_id: user.id_empresa,
       // role: user.role || 'user',
        status: user.estatus,
        last_login: user.ultimo_acceso,
        created_at: user.fe_registro
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 