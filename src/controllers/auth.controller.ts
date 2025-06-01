// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'hotel_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'hotel_refresh_secret_key';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ error: 'Логин и пароль обязательны' });
  }

  try {
    // Ищем админа
    const result = await db.query('SELECT * FROM admins WHERE login = $1', [login]);
    const admin = result.rows[0];

    if (!admin) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const accessToken = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({ id: admin.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    await db.query(
      'INSERT INTO refresh_tokens (admin_id, token, expires_at) VALUES ($1, $2, $3)',
      [admin.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    res.cookie('token', accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Вход успешен', admin });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

  export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
  
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh токен не найден' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number };
  
      const result = await db.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken]);
      const storedToken = result.rows[0];
  
      if (!storedToken) {
        res.status(403).json({ error: 'Недействительный refresh токен' });
      }
  
      const newAccessToken = jwt.sign({ id: storedToken.admin_id }, JWT_SECRET, { expiresIn: '1h' });
  
      res.cookie('token', newAccessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  
      res.json({ token: newAccessToken });
    } catch (err) {
      res.status(403).json({ error: 'Недействительный refresh токен' });
    }
  };