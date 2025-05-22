// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import db from '../config/db';
import { comparePassword, generateToken } from '../utils/auth.utils';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ error: 'Логин и пароль обязательны' });
  }

  try {
    const result = await db.query('SELECT * FROM admins WHERE login = $1', [login]);
    const admin = result.rows[0];

    if (!admin) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const isValidPassword = await comparePassword(password, admin.password_hash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = generateToken(admin.id);
    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Вход успешен', admin });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};