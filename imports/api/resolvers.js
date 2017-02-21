import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import Commenters from '/imports/collections/commenters';
import Comments from '/imports/collections/comments';
import DiscussionComments from '/imports/collections/discussionComments';
import Keywords from '/imports/collections/keywords';
import ReferenceWorks from '/imports/collections/referenceWorks';
import TextNodes from '/imports/collections/textNodes';
import Works from '/imports/collections/works';

function parseJSONLiteral(ast) {
	switch (ast.kind) {
		case Kind.STRING:
		case Kind.BOOLEAN:
			return ast.value;
		case Kind.INT:
		case Kind.FLOAT:
			return parseFloat(ast.value);
		case Kind.OBJECT: {
			const value = Object.create(null);
			ast.fields.forEach(field => {
				value[field.name.value] = parseJSONLiteral(field.value);
			});

			return value;
		}
		case Kind.LIST:
			return ast.values.map(parseJSONLiteral);
		default:
			return null;
	}
}

// create the resolve functions for the available GraphQL queries
export default resolvers = {
	Query: {
		commenters(_, args){
			return Commenters.find(args).fetch();
		},
		comments(_, args){
			return Comments.find(args).fetch();
		},
		discussionComments(_, args){
			return DiscussionComments.find(args).fetch();
		},
		keywords(_, args){
			return Keywords.find(args).fetch();
		},
		referenceWorks(_, args){
			return ReferenceWorks.find(args).fetch();
		},
		textNodes(_, args){
			return TextNodes.find(args).fetch();
		},
		works(_, args){
			if ('title' in args) {
				args.english_title = { $regex: args.title, $options: 'i'}
			}
			return Works.find(args).fetch();
		},
	},

	Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

	JSON: {
		__parseLiteral: parseJSONLiteral,
		__serialize: value => value,
		__parseValue: value => value,
	},
};
