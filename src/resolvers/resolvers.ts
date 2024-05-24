import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import { JWT_SECRET } from '../config';
import { usersResolver } from './queries/users';
import { meResolver } from './queries/me';
import { registerResolver } from './mutations/register';
import { loginResolver } from './mutations/login';
import { logoutResolver } from './mutations/logout';
import { refreshTokenResolver } from './mutations/refleshToken';

const resolvers: IResolvers = {
  Query: {
    users: usersResolver,
    me: meResolver
  },
  Mutation: {
    register: registerResolver,
    login: loginResolver,
    logout: logoutResolver,
    refreshToken: refreshTokenResolver
  },
};

export default resolvers;
