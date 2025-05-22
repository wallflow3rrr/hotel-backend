import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

const getAdminRooms = async (req: express.Request, res: express.Response): Promise<void> => {
  res.json([
    { id: 1, title: 'Стандартный двухместный' },
    { id: 2, title: 'Люкс с видом на море' }
  ]);
};

router.get('/admin/rooms', authenticateJWT, getAdminRooms);

export default router;