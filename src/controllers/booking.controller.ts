// src/controllers/booking.controller.ts

import express from 'express';
import db from '../config/db';

type Request = express.Request;
type Response = express.Response;

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  const { room_id, guest_name, email, start_date, end_date } = req.query;

  let query = 'SELECT * FROM bookings WHERE TRUE';
  const values: any[] = [];
  let index = 1;

  if (room_id && !isNaN(Number(room_id))) {
    query += ` AND room_id = $${index++}`;
    values.push(Number(room_id));
  }

  if (guest_name && typeof guest_name === 'string') {
    query += ` AND guest_name ILIKE $${index++}`;
    values.push(`%${guest_name}%`);
  }

  if (email && typeof email === 'string') {
    query += ` AND email ILIKE $${index++}`;
    values.push(`%${email}%`);
  }

  if (start_date) {
    query += ` AND start_date >= $${index++}`;
    values.push(start_date);
  }

  if (end_date) {
    query += ` AND end_date <= $${index++}`;
    values.push(end_date);
  }

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении бронирований:', err);
    res.status(500).json({ error: 'Не удалось загрузить список бронирований' });
  }
};