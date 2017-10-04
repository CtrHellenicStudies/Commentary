import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';

const UserProfileType = new GraphQLObjectType({
	name: 'UserProfileType',
	description: 'User type',
	fields: {
		name: {
			type: GraphQLString,
		},
		birthday: {
			type: GraphQLDate,
		},
		biography: {
			type: GraphQLString,
		},
		publicEmailAddress: {
			type: GraphQLString,
		},
		academiaEdu: {
			type: GraphQLString,
		},
		twitter: {
			type: GraphQLString,
		},
		facebook: {
			type: GraphQLString,
		},
		google: {
			type: GraphQLString,
		},
		avatarUrl: {
			type: GraphQLString,
		},
		location: {
			type: GraphQLString,
		},
		country: {
			type: GraphQLString,
		},
	}
});

const UserProfileInputType = new GraphQLInputObjectType({
	name: 'UserProfileInputType',
	description: 'User type',
	fields: {
		name: {
			type: GraphQLString,
		},
		birthday: {
			type: GraphQLDate,
		},
		biography: {
			type: GraphQLString,
		},
		publicEmailAddress: {
			type: GraphQLString,
		},
		academiaEdu: {
			type: GraphQLString,
		},
		twitter: {
			type: GraphQLString,
		},
		facebook: {
			type: GraphQLString,
		},
		google: {
			type: GraphQLString,
		},
		avatarUrl: {
			type: GraphQLString,
		},
		location: {
			type: GraphQLString,
		},
		country: {
			type: GraphQLString,
		},
	}
});

const UserType = new GraphQLObjectType({
	name: 'UserType',
	description: 'A single user',
	fields: {
		_id: {
			type: GraphQLString,
		},
		username: {
			type: GraphQLString,

		},
		isAnnotator: {
			type: GraphQLBoolean,

		},
		emails: {
			type: new GraphQLList(GraphQLJSON),

		},
		profile: {
			type: UserProfileType,

		},
		services: {
			type: GraphQLJSON,

		},
		subscriptions: {
			type: GraphQLJSON,
		},
		roles: {
			type: new GraphQLList(GraphQLString),

		},
		canEditCommenters: {
			type: new GraphQLList(GraphQLString),

		},
		bookmarks: {
			type: new GraphQLList(GraphQLJSON),

		},
		canAnnotateBooks: {
			type: new GraphQLList(GraphQLString),

		},
		authorOfBooks: {
			type: new GraphQLList(GraphQLString),

		},
		highlightingPreference: {
			type: GraphQLBoolean,

		},
		recentPositions: {
			type: new GraphQLList(GraphQLJSON),

		},
		createdAt: {
			type: GraphQLDate,

		},
		createdBy: {
			type: GraphQLString,

		},
		updatedAt: {
			type: GraphQLDate,

		},
		updatedBy: {
			type: GraphQLString,

		},
	},
});

const UserInputType = new GraphQLInputObjectType({
	name: 'UserInputType',
	description: 'A single user',
	fields: {
		username: {
			type: GraphQLString,

		},
		password: {
			type: GraphQLString,

		},
		isAnnotator: {
			type: GraphQLBoolean,

		},
		emails: {
			type: new GraphQLList(GraphQLJSON),

		},
		profile: {
			type: UserProfileInputType,

		},
		services: {
			type: GraphQLJSON,

		},
		subscriptions: {
			type: GraphQLJSON,
		},
		roles: {
			type: new GraphQLList(GraphQLString),

		},
		canEditCommenters: {
			type: new GraphQLList(GraphQLString),

		},
		bookmarks: {
			type: new GraphQLList(GraphQLJSON),

		},
		canAnnotateBooks: {
			type: new GraphQLList(GraphQLString),

		},
		authorOfBooks: {
			type: new GraphQLList(GraphQLString),

		},
		highlightingPreference: {
			type: GraphQLBoolean,

		},
		recentPositions: {
			type: new GraphQLList(GraphQLJSON),

		},
		createdAt: {
			type: GraphQLDate,

		},
		createdBy: {
			type: GraphQLString,

		},
		updatedAt: {
			type: GraphQLDate,

		},
		updatedBy: {
			type: GraphQLString,

		},
	},
});

const PositionType = new GraphQLObjectType({
	name: 'PositionType',
	description: 'A recent position where the user has been reading',
	fields: {
		title: {
			type: GraphQLString,
		},
		author: {
			type: GraphQLString,
		},
		link: {
			type: GraphQLString,
		},
		subtitle: {
			type: GraphQLString,
		},
		activeElem: {
			type: GraphQLInt,
		},
	},
});


const PositionInputType = new GraphQLInputObjectType({
	name: 'PositionInputType',
	description: 'A recent position where the user has been reading',
	fields: {
		title: {
			type: GraphQLString,
		},
		author: {
			type: GraphQLString,
		},
		link: {
			type: GraphQLString,
		},
		subtitle: {
			type: GraphQLString,
		},
		activeElem: {
			type: GraphQLInt,
		},
	},
});

export { UserType, UserInputType, PositionInputType };
