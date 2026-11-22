const jwt = require('jsonwebtoken');

const { randomBytes } = require('crypto');
if (process.env.NODE_ENV === 'production' && (process.env.JWT_SECRET || '').length < 32) {
  throw new Error('Configure JWT_SECRET with at least 32 random characters.');
}
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied for this role.'
    });
  }
  next();
};

const isAdmin = authorizeRoles('ADMIN');

// Student only middleware
const isStudent = (req, res, next) => {
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Student privileges required.' 
    });
  }
  next();
};

module.exports = { generateToken, verifyToken, authorizeRoles, isAdmin, isStudent, JWT_SECRET };
