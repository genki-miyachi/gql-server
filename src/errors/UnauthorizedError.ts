import { ApolloError } from 'apollo-server-errors';

export class UnauthorizedError extends ApolloError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');

    Object.defineProperty(this, 'name', { value: 'Unauthorized' });
  }
}
