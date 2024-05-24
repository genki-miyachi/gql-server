import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import { JWT_SECRET } from '../config';

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
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET as string, {
        expiresIn: '1h',
      });
      return token;
    },
  },
};

export default resolvers;
