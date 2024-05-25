import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { isTokenBlacklisted } from './tokenBlacklist';

export const getUserFromToken = async (token: string) => {
  try {
    if (!token || await isTokenBlacklisted(token)) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET as string);

    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};
