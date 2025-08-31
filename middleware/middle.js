import jwt from 'jsonwebtoken';

const secretKey = "$$"; 
const middle = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.json({ message: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.json({ message: 'Authorization token is required' });
  }
};

export default middle;