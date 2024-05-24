import db from "../../utils/db";

export async function meResolver(_: any, __: any, context: any): Promise<any> {
  if (!context.user) throw new Error('Not authenticated');
  return await db('users').where({ id: context.user.id }).first();
}
