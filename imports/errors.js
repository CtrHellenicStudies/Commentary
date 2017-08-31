import { createError } from 'apollo-errors';

/**
 * Authentication Error
 * @type {Error}
 */
export const AuthenticationError = createError('AuthenticationError', {
	message: 'Not authorized'
});
