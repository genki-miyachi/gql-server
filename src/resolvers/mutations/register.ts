import db from "../../utils/db";
import bcrypt from 'bcryptjs';

export async function registerResolver(_: any, { username, email, password }: any): Promise<any> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db('users').insert({ username, email, password: hashedPassword }).returning(['id', 'username', 'email']);
  return user;
}
