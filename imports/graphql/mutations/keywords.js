import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import { KeywordType, KeywordInputType} from '/imports/graphql/types/models/keyword';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Keywords from '/imports/models/keywords';

// logic
import KeywordService from '../logic/keywords';

const keywordsMutationFields = {
	keywordRemove: {
		type: RemoveType,
		description: 'Remove a single keyword',
		args: {
			keywordId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {keywordId}, {token}) {
			const keywordService = new KeywordService({token});
			return await keywordService.keywordRemove(keywordId);
		}
	},
	keywordUpdate: {
		type: KeywordType,
		description: 'Update a single keyword',
		args: {
			keywordId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			keyword: {
				type: new GraphQLNonNull(KeywordInputType)
			}
		},
		async resolve(parent, {keywordId, keyword}, {token}) {
			const keywordService = new KeywordService({token});
			return await keywordService.keywordUpdate(keywordId, keyword);
		}
	}
};

export default keywordsMutationFields;
