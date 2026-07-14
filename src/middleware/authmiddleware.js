// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect= (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  
  const token = authHeader && authHeader.split(' ')[1]; 

  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
   
    const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verifiedPayload; 
    
   
    next(); 
  } catch (error) {
  
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = protect;
