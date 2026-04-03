const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('JWT_SECRET não está definido. O servidor não pode autenticar requisições.');
}

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: `Token não fornecido ${token}` });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Ex: { id: 3, email: 'fulano@x.com' }
    console.log("Token encontrado: ", token)
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
