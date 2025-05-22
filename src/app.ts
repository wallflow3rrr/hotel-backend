// src/app.ts

import express from 'express';
import cookieParser from 'cookie-parser';

import roomRoutes from './routes/room.route';
import authRoute from './routes/auth.route';
import adminRoomRoute from './routes/admin.room.route';
import { authenticateJWT } from './middleware/auth.middleware';

const app = express();

// ✅ Подключи cookie-parser
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api', roomRoutes);
app.use('/api', authRoute);
app.use('/api', adminRoomRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});