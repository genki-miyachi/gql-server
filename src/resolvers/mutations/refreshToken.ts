import jwt from 'jsonwebtoken';
import db from "../../utils/db";
import { JWT_SECRET } from '../../config';
import { ACCESS_TOKEN_EXPIRY } from '../../constants';
import { NotFoundError } from '../../errors/NotFoundError';

export async function refreshTokenResolver(_: any, { token }: any):Promise<any> {
  const res = await db('refresh_tokens').where({ token }).first();
  if (!res) throw new NotFoundError('Invalid refresh token');

  const userId = res.user_id;
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  return { accessToken };
}
