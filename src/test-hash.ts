
import { hashPassword } from './utils/auth.utils';
import db from './config/db';

const run = async () => {
  const hashed = await hashPassword('admin123');
  await db.query('UPDATE admins SET password_hash = $1 WHERE login = $2', [hashed, 'admin']);
  console.log('Пароль обновлён');
};

run();