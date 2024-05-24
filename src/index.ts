import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schemas/userSchema';
import resolvers from './resolvers/userResolver';
import { getUserFromToken } from './utils/auth';
import { SERVER_PORT } from './config';

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: SERVER_PORT }, () => {
    console.log(`Server ready at http://localhost:${SERVER_PORT}${server.graphqlPath}`);
  });
};

startServer();
