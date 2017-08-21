import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import slugify from 'slugify';
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';
import DiscussionComments from '/imports/models/discussionComments';
import Keywords from '/imports/models/keywords';
import LinkedDataSchemas from '/imports/models/linkedDataSchemas';
import ReferenceWorks from '/imports/models/referenceWorks';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

// create the resolve functions for the available GraphQL queries
const resolvers = {
	Query: {
		comments(_, args) {
			let limit = 1000;
			let skip = 0;
			if ('work' in args) {
				args['work.slug'] = slugify(args.work);
				delete args.work;
			}
			if ('subwork' in args) {
				args['subwork.n'] = parseInt(args.subwork, 10);
				delete args.subwork;
			}
			if ('commenter' in args) {
				args.$or = [
					{
						'commenters.name': {
							$regex: args.commenter,
							$options: 'i'
						},
					},
					{
						'commenters.slug': {
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
						'keywords.title': {
							$regex: args.keyword,
							$options: 'i'
						},
					},
					{
						'keywords.slug': {
							$regex: args.commenter,
							$options: 'i'
						},
					}
				];
				if (!('$or' in args)) {
					args.$or = keywordQueries;
				} else {
					args.$or.push(...args.$or, keywordQueries);
				}
				delete args.keyword;
			}
			if ('user' in args) {
				args['users.username'] = { $regex: args.user, $options: 'i'};
				delete args.user;
			}
			if ('limit' in args) {
				limit = args.limit;
				delete args.limit;
			}
			if ('skip' in args) {
				skip = args.skip;
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
		discussionComments(_, args) {
			let limit = 1000;
			let skip = 0;
			if ('user' in args) {
				args['users.username'] = { $regex: args.user, $options: 'i'};
				delete args.user;
			}
			if ('content' in args) {
				args.content = { $regex: args.content, $options: 'i'};
			}
			if ('voter' in args) {
				args.voters = args.voter;
				delete args.voter;
			}
			if ('limit' in args) {
				limit = args.limit;
				delete args.limit;
			}
			if ('skip' in args) {
				skip = args.skip;
				delete args.skip;
			}
			return DiscussionComments.find(args, {sort: {'users.username': 1}, limit, skip }).fetch();
		},
		keywords(_, args) {
			let keywords = [];
			const linkedDataSchema = LinkedDataSchemas.findOne({ collectionName: 'Keywords' });
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
				args.title = { $regex: args.title, $options: 'i'};
			}
			if ('description' in args) {
				args.description = { $regex: args.description, $options: 'i'};
			}
			if ('work' in args) {
				args['work.slug'] = slugify(args.work);
				delete args.work;
			}
			if ('subwork' in args) {
				args['subwork.n'] = parseInt(args.subwork, 10);
				delete args.subwork;
			}

			const response = [];
			keywords = Keywords.find(args, { sort: { title: 1 } }).fetch();

			if (returnJSONLD) {
				if (context !== null) {
					keywords.forEach((keyword) => {
						const isInContext = false;
						const contextKeys = [];

						for (k in context) {  // eslint-disable-line
							contextKeys.push(k);
						}

						for (key in keyword) {  // eslint-disable-line
							if (!(~contextKeys.indexOf(key))) {
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
		referenceWorks(_, args) {
			if ('description' in args) {
				args.description = { $regex: args.description, $options: 'i'};
			}
			if ('citation' in args) {
				args.citation = { $regex: args.citation, $options: 'i'};
			}
			return ReferenceWorks.find(args, { sort: { title: 1 } }).fetch();
		},
		textNodes(_, args) {
			let limit = 1000;
			let skip = 0;
			if ('edition' in args) {
				args['text.edition.slug'] = { $regex: slugify(args.edition), $options: 'i'};
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
				args['subwork.n'] = parseInt(args.subwork, 10);
				delete args.subwork;
			}
			if ('relatedPassageWork' in args) {
				args['related_passages.work.slug'] = { $regex: slugify(args.relatedPassageWork), $options: 'i'};
				delete args.relatedPassageWork;
			}
			if ('relatedPassageSubwork' in args) {
				args['related_passages.subwork.n'] = parseInt(args.relatedPassageSubwork, 10);
				delete args.relatedPassageSubwork;
			}
			if ('relatedPassageLineFrom' in args) {
				args['related_passages.text.n'] = { $gte: args.relatedPassageLineFrom };
				delete args.relatedPassageLineFrom;
			}
			if ('relatedPassageLineTo' in args) {
				args['related_passages.text.n'] = { $lte: args.relatedPassageLineTo };
				delete args.relatedPassageLineTo;
			}
			if ('relatedPassageText' in args) {
				args['related_passages.text.text'] = { $regex: args.relatedPassageText, $options: 'i' };
				delete args.relatedPassageText;
			}
			if ('limit' in args) {
				limit = args.limit;
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
		works(_, args) {
			if ('title' in args) {
				args.title = { $regex: args.title, $options: 'i'};
			}
			if ('slug' in args) {
				args.slug = { $regex: args.slug, $options: 'i'};
			}
			return Works.find(args).fetch();
		},
	},

};

export default resolvers;
