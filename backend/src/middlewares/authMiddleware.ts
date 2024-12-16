import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const JWT_SECRET = process.env.JWT_SECRET; // Asegúrate de que esto esté definido en .env

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno.");
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido.' });
  }

  const token =  authHeader.split(' ')[1] ;
    if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
}

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = decoded;
    next();

  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado. Por favor, inicie sesión nuevamente.' });
    }
    return res.status(403).json({ message: 'Token no válido o expirado.' });
  }
};
