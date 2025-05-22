// src/app.ts

import express from 'express';
import cookieParser from 'cookie-parser';

import roomRoutes from './routes/room.route';
import authRoute from './routes/auth.route';
import adminRoomRoute from './routes/admin.room.route';
import { authenticateJWT } from './middleware/auth.middleware';
import swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';

const app = express();


app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api', roomRoutes);
app.use('/api', authRoute);
app.use('/api', adminRoomRoute);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});