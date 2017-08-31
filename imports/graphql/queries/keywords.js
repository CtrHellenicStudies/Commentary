import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import KeywordType from '/imports/graphql/types/models/keyword';

// models
import Keywords from '/imports/models/keywords';

const keywordQueryFields = {
	keywords: {
		type: KeywordType,
		description: 'Get list of keywords (tags)',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		resolve({ tenantId }, context) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			/*
			 * TODO: reinstate the linked data api schema
			 *
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

			*/

			return Keywords.find(args, {
				sort: {
					slug: 1,
				},
			});
		}
	},
};

export default keywordQueryFields;