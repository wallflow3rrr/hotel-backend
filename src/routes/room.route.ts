// src/routes/room.route.ts

import express from 'express';
import { getAllRooms } from '../controllers/room.controller';

const router = express.Router();

router.get('/rooms', getAllRooms);

export default router;