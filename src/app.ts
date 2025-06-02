
import express from 'express';
import cookieParser from 'cookie-parser';
import roomRoutes from './routes/room.route';
import authRoute from './routes/auth.route';
import adminRoomRoute from './routes/admin.room.route';
import swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';
import bookingRoute from './routes/booking.route';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', roomRoutes);
app.use('/api', authRoute);
app.use('/api', adminRoomRoute);
app.use('/api', bookingRoute);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT);
console.log(`Server running on http://localhost:${PORT}`);
