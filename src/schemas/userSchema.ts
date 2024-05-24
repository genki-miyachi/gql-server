import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    users: [User]
    me: User
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    refreshToken(token: String!): AuthPayload
  }

  type AuthPayload {
    accessToken: String
    refreshToken: String
  }
`;

export default typeDefs;
