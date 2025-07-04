const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET

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
