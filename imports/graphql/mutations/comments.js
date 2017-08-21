import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import ProjectType from '../types/models/project';

// models
import Project from '../../models/project';

// errors
import { AuthenticationError } from '../../errors';

const projectMutationFileds = {

	projectCreate: {
		type: ProjectType,
		description: 'Create new project',
		args: {
			title: {
				type: new GraphQLNonNull(GraphQLString),
			},
			description: {
				type: GraphQLString,
			},
		},
		resolve(parent, { title, description }, { user, tenant }) {

			// only a logged in user and coming from the admin page, can create new project
			if (user && tenant.adminPage) {
				const otherFields = {
					title,
					description,
				};
				return Project.createByOwner(user._id, otherFields);
			}
			throw AuthenticationError();
		}
	}
};

export default projectMutationFileds;
