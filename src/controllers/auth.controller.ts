
import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hotel_secret_key';

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

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Вход успешен', admin });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};