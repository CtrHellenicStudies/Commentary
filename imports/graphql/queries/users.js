import { GraphQLString, GraphQLList } from 'graphql';

// types
import { UserType } from '/imports/graphql/types/models/user';

// bll
import UserService from '../bll/users';

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
};

export default usersQueryFields;
