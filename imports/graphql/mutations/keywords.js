import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import { KeywordType} from '/imports/graphql/types/models/keyword';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Keywords from '/imports/models/keywords';

// bll
import KeywordService from '../bll/keywords';

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
	}
};

export default keywordsMutationFields;
