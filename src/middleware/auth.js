const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'bloodconnect_default_secret_key_2024';

// JWT auth middleware
function ensureAuth(req, res, next) {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  const bestType = req.accepts ? req.accepts(['json', 'html']) : 'json';
  const isApiRequest = String(req.originalUrl || '').toLowerCase().startsWith('/api');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For API requests, always return JSON 401 (never redirect)
    if (isApiRequest || bestType === 'json') {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // For non-API HTML navigations, redirect to login page
    if (bestType === 'html') return res.redirect('/login.html');
    
    // Otherwise return JSON 401
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    // For API requests, always return JSON 401 (never redirect)
    if (isApiRequest || bestType === 'json') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // For non-API HTML navigations, redirect to login page
    if (bestType === 'html') return res.redirect('/login.html');
    
    // Otherwise return JSON 401
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { ensureAuth };
