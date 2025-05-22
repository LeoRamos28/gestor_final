// src/middlewares/auth.middleware.ts
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Extiende Request solo para tus controladores, no para la firma del middleware
export interface AuthRequest extends Express.Request {
  userId?: number;
}

// Ahora definí el middleware como RequestHandler
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'clave_secreta';
    const payload = jwt.verify(token, secret) as { userId: number };
    // casteo interno: RequestHandler usa la firma estándar, pero aquí forzás el userId
    (req as AuthRequest).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
