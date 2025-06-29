const jwt = require('jsonwebtoken');
const SECRET = 'a98f3c0b1e7d42f4b9c8f62a6db6e9b2f3a0d1c4e5f6a7b8c9d0e1f2a3b4c5d6';

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Ex: { id: 3, email: 'fulano@x.com' }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
