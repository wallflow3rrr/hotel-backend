
import { hashPassword, generateToken } from './utils/auth.utils';

const testAuthUtils = async () => {
  const hash = await hashPassword('123456');
  console.log('Hash:', hash);

  const token = generateToken(1);
  console.log('Token:', token);
};

testAuthUtils();