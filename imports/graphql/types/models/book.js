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
import { Meteor } from 'meteor/meteor';

import CommentType from './comment';
import Comments from '../../../models/comments';

const BookInputType = new GraphQLInputObjectType({
	name: 'BookInputType',
	description: 'A book input type',
	fields: {
		title: {
			type: GraphQLString
		},
		slug: {
			type: GraphQLString
		},
		author: {
			type: GraphQLString
		},
		authorURN: {
			type: GraphQLString
		},
		chapters: {
			type: new GraphQLList(GraphQLJSON)
		},
		coverImage: {
			type: GraphQLString
		},
		year: {
			type: GraphQLInt
		},
		publisher: {
			type: GraphQLString
		},
		citation: {
			type: GraphQLString
		},
		tenantId: {
			type: GraphQLString
		}
	}
});

const BookType = new GraphQLObjectType({
	name: 'BookType',
	description: 'A single book',
	fields: {
		_id: {
			type: GraphQLString
		},
		title: {
			type: GraphQLString
		},
		slug: {
			type: GraphQLString
		},
		author: {
			type: GraphQLString
		},
		chapters: {
			type: new GraphQLList(GraphQLJSON)
		},
		coverImage: {
			type: GraphQLString
		},
		year: {
			type: GraphQLInt
		},
		publisher: {
			type: GraphQLString
		},
		citation: {
			type: GraphQLString
		},
		tenantId: {
			type: GraphQLString
		},
		/**
		// TODO: Debug why Meteor is not able to resolve queries on graphql types
		// due to a node fibers issue
		annotations: {
			type: new GraphQLList(CommentType),
			args: {
				chapterUrl: { type: GraphQLString }
			},
			resolve: ( _, { chapterUrl }, context ) => {
				const getComments = Meteor.bindEnvironment(_chapterUrl => {
					return Comments.find({
						bookChapterUrl: _chapterUrl,
					});
				});
				return getComments(chapterUrl);
			}
		}
		*/
	}
});

export { BookInputType, BookType };
