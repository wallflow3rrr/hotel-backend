// src/routes/booking.route.ts

import express from 'express';
import { getAllBookings } from '../controllers/booking.controller';

const router = express.Router();

router.get('/bookings', getAllBookings);

export default router;