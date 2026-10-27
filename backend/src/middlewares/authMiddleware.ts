import { Request, Response, NextFunction } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { getJwtSecret } from '../utils/jwtSecret';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authorization = req.headers.authorization;
  const token = authorization?.match(/^Bearer ([^\s]+)$/i)?.[1];
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  let decoded: string | jsonwebtoken.JwtPayload;
  try {
    decoded = jsonwebtoken.verify(token, getJwtSecret());
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
    return;
  }

  if (typeof decoded === 'string' || typeof decoded.id !== 'string') {
    res.status(401).json({ message: 'Not authorized, token failed' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
