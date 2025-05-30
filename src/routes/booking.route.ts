
import express from 'express';
import { createBooking, getAllBookings } from '../controllers/booking.controller';

const router = express.Router();

router.get('/bookings', getAllBookings);

router.post('/bookings', createBooking);

export default router;