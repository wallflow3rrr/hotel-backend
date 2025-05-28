
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hotel_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'hotel_refresh_secret_key';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    return next();
  } catch (err) {
    return next();
  }
};

export const checkRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh токен не найден' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number };
    (req as any).adminId = decoded.id;
    return next();
  } catch (err) {
    res.status(403).json({ error: 'Недействительный refresh токен' });
  }
};