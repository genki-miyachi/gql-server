import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import { JWT_SECRET } from '../config';

const ACCESS_TOKEN_EXPIRY = '15m';  // アクセストークンの有効期限
const REFRESH_TOKEN_EXPIRY = '7d';  // リフレッシュトークンの有効期限

const resolvers: IResolvers = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const res = await pool.query('SELECT id, username, email FROM users');
      return res.rows;
    },
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const res = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [context.user.id]);
      return res.rows[0];
    },
  },
  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const res = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
      );
      return res.rows[0];
    },
    login: async (_: any, { email, password }: any) => {
      const res = await pool.query('SELECT id, username, email, password FROM users WHERE email = $1', [email]);
      const user = res.rows[0];
      if (!user) throw new Error('No user with that email');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Incorrect password');

      const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET as string, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      // リフレッシュトークンをDBに保存
      await pool.query('INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)', [refreshToken, user.id]);

      return { accessToken, refreshToken };
    },
    logout: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const refreshToken = context.req.headers.authorization?.split(' ')[1] || '';
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      return true;
    },
    refreshToken: async (_: any, { token }: any) => {
      const res = await pool.query('SELECT user_id FROM refresh_tokens WHERE token = $1', [token]);
      if (res.rowCount === 0) throw new Error('Invalid refresh token');

      const userId = res.rows[0].user_id;
      const accessToken = jwt.sign({ id: userId }, JWT_SECRET as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      return { accessToken };
    },
  },
};

export default resolvers;
