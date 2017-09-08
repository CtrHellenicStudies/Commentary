import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import { WorkType, WorkInputType } from '/imports/graphql/types/models/work';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Works from '/imports/models/works';

// bll
import WorksService from '../bll/works';

const worksMutationFields = {
	workCreate: {
		type: WorkType,
		description: 'Create a new work',
		args: {
			work: {
				type: WorkInputType
			}
		},
		async resolve(parent, { work }, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workInsert(work);
		}
	},
	workUpdate: {
		type: WorkType,
		description: 'Update a work',
		args: {
			_id: {
				type: GraphQLString
			},
			work: {
				type: WorkInputType
			}
		},
		async resolve(parent, { _id, work }, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workUpdate(_id, work);
		}
	},
	workRemove: {
		type: RemoveType,
		description: 'Remove single work',
		args: {
			workId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {workId}, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workRemove(workId);
		}
	}
};

export default worksMutationFields;
