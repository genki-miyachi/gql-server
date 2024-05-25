import db from "../../utils/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from "../../config";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../../constants";

export async function loginResolver(_: any, { email, password }: any):Promise<any> {
  const user = await db('users').where({ email }).first();
  if (!user) throw new Error('No user with that email');
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Incorrect password');

  const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  await db('refresh_tokens').insert({ token: refreshToken, user_id: user.id });

  return { accessToken, refreshToken };
}
