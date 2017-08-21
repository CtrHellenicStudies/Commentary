import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import ProjectType from '../types/models/project';

// models
import Project from '../../models/project';

const projectQueryFields = {
	commenters: {
		type: CommenterType,
		description: 'Get list of commenters',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLID),
			},
		},
		resolve(tenant, { _id }, context) {
			if ('name' in args) {
				args.name = { $regex: args.name, $options: 'i'};
			}
			if ('slug' in args) {
				args.slug = { $regex: args.slug, $options: 'i'};
			}
			return Commenters.find(args, {sort: {name: 1}}).fetch();
		}
	},
};

export default commenterQueryFields;
