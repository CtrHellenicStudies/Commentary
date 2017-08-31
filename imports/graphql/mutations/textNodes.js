import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';
import { Meteor } from 'meteor/meteor';

// types
import TextNodeType from '/imports/graphql/types/models/textNode';

// models
import TextNodes from '/imports/models/textNodes';
import Tenants from '/imports/models/tenants';

// errors
import { AuthenticationError } from '/imports/errors';

const textNodeMutationFields = {
	textNodeCreate: {
		type: TextNodeType,
		description: 'Create new textNode',
		args: {
			text: {
				type: new GraphQLNonNull(GraphQLJSON),
			},
			work: {
				type: new GraphQLNonNull(GraphQLJSON),
			},
			subwork: {
				type: new GraphQLNonNull(GraphQLJSON),
			},
		},
		resolve(parent, { text, work, subwork, edition}, { userId, tenantId }) {
			const user = Meteor.users.findOne({ _id: userId });
			const tenant = Tenants.findOne({ _id: tenantId });

			if (!user || !tenant) {
				throw AuthenticationError();
			}

			return TextNodes.insert({
				tenantId,
				text,
				work,
				subwork,
				relatedPassages,
			});
		}
	}
};

export default textNodeMutationFields;
