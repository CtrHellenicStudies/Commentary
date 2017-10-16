/**
 * Queries for users
 */
import { GraphQLString, GraphQLList } from 'graphql';

// types
import { UserType } from '/imports/graphql/types/models/user';

// logic
import UserService from '../logic/users';

const usersQueryFields = {
	users: {
		type: new GraphQLList(UserType),
		description: 'Get list of users',
		args: {
			_id: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { _id }, {token}) {
			const userService = new UserService({token});
			return await userService.usersGet(_id);
		}
	},
	getAuthedUser: {
		type: UserType,
		description: 'Return a single users account by their login token',
		async resolve(parent, {}, { token }) {
			const userService = new UserService({token});
			return await userService.getAuthedUser();
		}
	},
	userGetPublicById: {
		type: UserType,
		description: 'Return public information about a single user by their user Id',
		args: {
			_id: {
				type: GraphQLString,
			},
		},
		async resolve(parent, { _id }, {token}) {
			const userService = new UserService({token});
			return await userService.userGetPublicById(_id);
		}
	},
	usersGetPublicById: {
		type: new GraphQLList(UserType),
		description: 'Return public information about a single user by their user Id',
		args: {
			userIds: {
				type: new GraphQLList(GraphQLString),
			},
		},
		async resolve(parent, { userIds }, { token }) {
			const userService = new UserService({ token });
			return await userService.usersGetPublicById(userIds);
		}
	},
};

export default usersQueryFields;
