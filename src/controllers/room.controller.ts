// src/controllers/room.controller.ts

import express from 'express';
import db from '../config/db';

type Request = express.Request;
type Response = express.Response;

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Получаем ID из URL

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: 'ID должен быть числом' });
    return;
  }

  try {
    const result = await db.query('SELECT * FROM rooms WHERE id = $1', [Number(id)]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Номер не найден' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении номера:', err);
    res.status(500).json({ error: 'Не удалось загрузить номер' });
  }
};

export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  const { title, minPrice, maxPrice, beds, bedType } = req.query;

  let query = 'SELECT * FROM rooms WHERE TRUE';
  const values: any[] = [];
  let index = 1;

  if (title && typeof title === 'string') {
    query += ` AND title ILIKE $${index++}`;
    values.push(`%${title}%`);
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    query += ` AND price >= $${index++}`;
    values.push(Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    query += ` AND price <= $${index++}`;
    values.push(Number(maxPrice));
  }

  if (beds && !isNaN(Number(beds))) {
    query += ` AND available_beds >= $${index++}`;
    values.push(Number(beds));
  }

  if (bedType && typeof bedType === 'string') {
    query += ` AND bed_type ILIKE $${index++}`;
    values.push(`%${bedType}%`);
  }

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении комнат:', err);
    res.status(500).json({ error: 'Не удалось загрузить список номеров' });
  }
};