import db from './db';

export const addTokenToBlacklist = async (token: string) => {
  await db('refresh_tokens').insert({ token });
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const res = await db('refresh_tokens').where({ token }).first();
  return !!res;
};
