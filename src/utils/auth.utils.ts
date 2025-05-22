// src/utils/auth.utils.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'hotel_secret_key';

export const generateToken = (adminId: number): string => {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: '1h' });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};