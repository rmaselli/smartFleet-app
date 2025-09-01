const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(" <<Middleware Token:", token);
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    console.log("🔐 Auth middleware: Token received:", token.substring(0, 20) + "...");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log("🔐 Auth middleware: Token decoded:", decoded);
    
    // Get user from flveh_s002 table using userId from token
    const [rows] = await pool.execute(
      'SELECT id_empresa, id_usuario, nombre, usuario, email, pass, token, ultimo_acceso, fe_registro, estatus FROM FLVEHI.flveh_s002 WHERE id_empresa = ? AND estatus = "ACT"',
      [decoded.userId]
    );
    
    console.log("🔐 Auth middleware: User lookup result:", rows.length > 0 ? "User found" : "User not found");
    console.log("🔐 Auth middleware: Looking for userId:", decoded.userId);

    if (rows.length === 0) {  
      return res.status(401).json({ error: 'Invalid token. User not found or inactive.' });
    }

    // Assign user data to req.user with proper structure
    const userData = rows[0];
    req.user = {
      id_empresa: userData.id_empresa,
      id_usuario: userData.id_usuario,
      nombre: userData.nombre,
      usuario: userData.usuario,
      email: userData.email,
      //role: userData.role || 'user',
      estatus: userData.estatus,
      ultimo_acceso: userData.ultimo_acceso,
      fe_registro: userData.fe_registro
    };
    
    console.log("🔐 Auth middleware: User data assigned to req.user:", {
      id_empresa: req.user.id_empresa,
      usuario: req.user.usuario
      //role: req.user.role
    });
    
    next();
    
  } catch (error) {
    console.error('🔐 Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { auth, adminAuth }; 