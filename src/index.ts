import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schemas/userSchema';
import resolvers from './resolvers/resolvers';
import { getUserFromToken } from './utils/auth';
import { SERVER_PORT } from './config';

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUserFromToken(token);

      return { user, req };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: SERVER_PORT }, () => {
    console.log(`Server ready at http://localhost:${SERVER_PORT}${server.graphqlPath}`);
  });
};

startServer();
