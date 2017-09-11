import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import { Re, KeywordInputType} from '/imports/graphql/types/models/referenceWork';
import { RemoveType } from '/imports/graphql/types/index';

// models
import ReferenceWorks from '/imports/models/referenceWorks';

// bll
import ReferenceWorksService from '../bll/referenceWorks';

const referenceWorksMutationFields = {
	referenceWorkRemove: {
		type: RemoveType,
		description: 'Remove a single reference work',
		args: {
			referenceWorkId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {referenceWorkId}, {token}) {
			const referenceWorksService = new ReferenceWorksService({token});
			return await referenceWorksService.referenceWorkRemove(referenceWorkId);
		}
	}
};

export default referenceWorksMutationFields;
