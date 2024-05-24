import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const getUserFromToken = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET as string);
    }
    return null;
  } catch (error) {
    return null;
  }
};
