
import express from 'express';
import { getAllRooms, getRoomById } from '../controllers/room.controller';


const router = express.Router();

router.get('/rooms', getAllRooms);
router.get('/rooms/:id', getRoomById); 

export default router;