
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import db from '../config/db';

const router = express.Router();

router.get('/admin/bookings', authenticateJWT, async (req: express.Request, res: express.Response) => {
  try {
    const result = await db.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось получить бронирования' });
  }
});


export default router;