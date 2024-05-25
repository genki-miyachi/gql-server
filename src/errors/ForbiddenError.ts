import { ApolloError } from 'apollo-server-errors';

export class ForbiddenError extends ApolloError {
  constructor(message: string) {
    super(message, 'FORBIDDEN');

    Object.defineProperty(this, 'name', { value: 'Firbidden' });
  }
}
