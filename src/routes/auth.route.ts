
import express from 'express';
import { loginAdmin } from '../controllers/auth.controller';
import { refreshAccessToken} from '../controllers/auth.controller';
import {checkRefreshToken} from '../middleware/auth.middleware'

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/refresh-token', checkRefreshToken, refreshAccessToken);

export default router;
