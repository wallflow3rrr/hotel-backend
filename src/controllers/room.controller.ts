// src/controllers/room.controller.ts

import express from 'express';
import db from '../config/db';

type Request = express.Request;
type Response = express.Response;

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