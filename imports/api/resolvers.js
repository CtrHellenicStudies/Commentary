import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import slugify from 'slugify';
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
			if ('name' in args) {
				args.name = { $regex: args.name, $options: 'i'}
			}
			if ('slug' in args) {
				args.slug = { $regex: args.slug, $options: 'i'}
			}
			return Commenters.find(args, {sort: {name : 1}}).fetch();
		},
		comments(_, args){
			let limit = 1000;
			let skip = 0;
			if ('work' in args) {
				args['work.slug'] = slugify(args.work);
				delete args.work;
			}
			if ('subwork' in args) {
				args['subwork.n'] = parseInt(args.subwork);
				delete args.subwork;
			}
			if ('commenter' in args) {
				args.$or = [
					{
						 'commenters.name' : {
							 $regex: args.commenter,
							 $options: 'i'
						 },
					},
					{
						 'commenters.slug' : {
							 $regex: args.commenter,
							 $options: 'i'
						 },
					}
				];
				delete args.commenter;
			}
			if ('keyword' in args) {
				const keywordQueries = [
					{
						 'keywords.title' : {
							 $regex: args.keyword,
							 $options: 'i'
						 },
					},
					{
						 'keywords.slug' : {
							 $regex: args.commenter,
							 $options: 'i'
						 },
					}
				];
				if (!('$or' in args)) {
					args.$or = keywordQueries;
				} else {
					args.$or.push.apply(args.$or, keywordQueries);
				}
				delete args.keyword;
			}
			if ('user' in args) {
				args['users.username'] = { $regex: args.user, $options: 'i'}
				delete args.user;
			}
			if ('limit' in args) {
				limit = args.limit
				delete args.limit;
			}
			if ('skip' in args) {
				skip = args.skip
				delete args.skip;
			}

			return Comments.find(args, {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
				skip,
				limit,
			}).fetch();
		},
		discussionComments(_, args){
			let limit = 1000;
			let skip = 0;
			if ('user' in args) {
				args['users.username'] = { $regex: args.user, $options: 'i'}
				delete args.user;
			}
			if ('content' in args) {
				args.content = { $regex: args.content, $options: 'i'}
			}
			if ('voter' in args) {
				args.voters = args.voter;
				delete args.voter;
			}
			if ('limit' in args) {
				limit = args.limit
				delete args.limit;
			}
			if ('skip' in args) {
				skip = args.skip
				delete args.skip;
			}
			return DiscussionComments.find(args, {sort: {'users.username' : 1}, limit, skip }).fetch();
		},
		keywords(_, args){
			let keywords = [];
			const linkedDataSchema = LinkedDataSchemas.findOne({ collectionName: "Keywords" });
			let context = null;
			let returnJSONLD = false;

			if (linkedDataSchema) {
				context = {};
				linkedDataSchema.terms.forEach((term) => {
					if (
							'resourceIdentifier' in term
						&& term.resourceIdentifier
						&& term.resourceIdentifier.length
					) {
						context[term.term] = term.resourceIdentifier;
					} else if (
						'metafields' in term
						&& term.metafields
						&& term.metafields.length
					) {
						context[term.term] = {};
						term.metafields.forEach((metafield) => {
								context[term.term][metafield.key] = metafield.value;
						});
					}
				});
			}

			if ('jsonld' in args) {
				returnJSONLD = true;
				delete args.jsonld;
			}

			if ('title' in args) {
				args.title = { $regex: args.title, $options: 'i'}
			}
			if ('description' in args) {
				args.description = { $regex: args.description, $options: 'i'}
			}
			if ('work' in args) {
				args['work.slug'] = slugify(args.work);
				delete args.work;
			}
			if ('subwork' in args) {
				args['subwork.n'] = parseInt(args.subwork);
				delete args.subwork;
			}

			const response = [];
			keywords = Keywords.find(args, { sort: { title: 1 } }).fetch();

			if (returnJSONLD) {
				if (context !== null) {
					keywords.forEach((keyword) => {
						let isInContext = false;
						const contextKeys = [];

						for (k in context) {
							contextKeys.push(k);
						}

						for (key in keyword) {
							if (!(~contextKeys.indexOf(key))){
								delete keyword[key];
							}
						}

						keyword['@context'] = context;
						response.push({jsonld: keyword});
					});
				} else {
				  throw new Error('JSONLD specified, but no available schema found');
				}
			}

			return response;
		},
		referenceWorks(_, args){
			if ('description' in args) {
				args.description = { $regex: args.description, $options: 'i'}
			}
			if ('citation' in args) {
				args.citation = { $regex: args.citation, $options: 'i'}
			}
			return ReferenceWorks.find(args, { sort: { title: 1 } }).fetch();
		},
		textNodes(_, args){
			let limit = 1000;
			let skip = 0;
			if ('edition' in args) {
				args['text.edition.slug'] = { $regex: slugify(args.edition), $options: 'i'}
				delete args.edition;
			}
			if ('lineFrom' in args) {
				args['text.n'] = { $gte: args.lineFrom };
				delete args.lineFrom;
			}
			if ('lineTo' in args) {
				args['text.n'] = { $lte: args.lineTo };
				delete args.lineTo;
			}
			if ('lineLetter' in args) {
				args['text.letter'] = args.lineLetter;
				delete args.lineLetter;
			}
			if ('text' in args) {
				args['text.text'] = { $regex: args.text, $options: 'i'};
				delete args.text;
			}
			if ('work' in args) {
				args['work.slug'] = slugify(args.work);
				delete args.work;
			}
			if ('subwork' in args) {
				args['subwork.n'] = parseInt(args.subwork);
				delete args.subwork;
			}
			if ('relatedPassageWork' in args) {
				args['related_passages.work.slug'] = { $regex: slugify(args.relatedPassageWork), $options: 'i'};
				delete args.relatedPassageWork;
			}
			if ('relatedPassageSubwork' in args) {
				args['related_passages.subwork.n'] = parseInt(args.relatedPassageSubwork);
				delete args.relatedPassageSubwork;
			}
			if ('relatedPassageLineFrom' in args) {
				args['related_passages.text.n'] =  { $gte: args.relatedPassageLineFrom };
				delete args.relatedPassageLineFrom;
			}
			if ('relatedPassageLineTo' in args) {
				args['related_passages.text.n'] =  { $lte: args.relatedPassageLineTo };
				delete args.relatedPassageLineTo;
			}
			if ('relatedPassageText' in args) {
				args['related_passages.text.text'] =  { $regex: args.relatedPassageText, $options: 'i' };
				delete args.relatedPassageText;
			}
			if ('limit' in args) {
				limit = args.limit
				delete args.limit;
			}
			if ('skip' in args) {
				skip = args.skip;
				delete args.skip;
			}

			return TextNodes.find(args, {
				sort: {
					'work.slug': 1,
					'text.n': 1,
				},
				limit,
				skip,
			}).fetch();
		},
		works(_, args){
			if ('title' in args) {
				args.title = { $regex: args.title, $options: 'i'}
			}
			if ('slug' in args) {
				args.slug = { $regex: args.slug, $options: 'i'}
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
