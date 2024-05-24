import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { isTokenBlacklisted } from './tokenBlacklist';

export const getUserFromToken = async (token: string) => {
  try {
    if (token && !(await isTokenBlacklisted(token))) {
      return jwt.verify(token, JWT_SECRET as string);
    }
    return null;
  } catch (error) {
    return null;
  }
};
