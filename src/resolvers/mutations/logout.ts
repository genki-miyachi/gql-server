import { UnauthorizedError } from "../../errors/UnauthorizedError";
import db from "../../utils/db";

export async function logoutResolver(_: any, __: any, context: any):Promise<any> {
  if (!context.user) throw new UnauthorizedError('Not authenticated');

  const refreshToken = context.req.headers.authorization
  const result = await db('refresh_tokens').where({ token: refreshToken }).del();

  if (result === 0) {
    throw new Error('Token not found');
  }
  return true;
}
