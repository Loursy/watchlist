import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];


  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Token yok' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err || typeof decoded !== 'object' || !('userId' in decoded)) {
      return res.status(403).json({ error: 'Token geçersiz' });
    }

    res.locals.userId = decoded.userId;
    next();
  });
};