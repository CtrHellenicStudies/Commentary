import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { Meteor } from 'meteor/meteor';

// types
import { UserType, UserInputType, PositionInputType } from '/imports/graphql/types/models/user';
import { RemoveType } from '/imports/graphql/types/index';

// bll
import UsersService from '../bll/users';

const usersMutationFields = {
	userCreate: {
		type: UserType,
		description: 'Create a new user',
		args: {
			user: {
				type: UserInputType
			}
		},
		async resolve(parent, { user }, {token}) {
			const usersService = new UsersService({token});
			return await usersService.userCreate(user);
		}
	},
	userUpdate: {
		type: UserType,
		description: 'Update a user',
		args: {
			_id: {
				type: GraphQLString
			},
			user: {
				type: UserInputType
			}
		},
		async resolve(parent, { _id, user }, {token}) {
			const usersService = new UsersService({token});
			return await usersService.userUpdate(_id, user);
		}
	},
	userRemove: {
		type: RemoveType,
		description: 'Remove a single user',
		args: {
			userId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {userId}, {token}) {
			const usersService = new UsersService({token});
			return await usersService.userRemove(userId);
		}
	},
	userUpdatePosition: {
		type: UserType,
		description: 'Update the recent positions array of a user',
		args: {
			position: {
				type: PositionInputType,
			}
		},
		async resolve(parent, { position }, { token }) {
			const usersService = new UsersService({ token });
			return await usersService.userUpdatePosition(position);
		}
	},
};

export default usersMutationFields;
