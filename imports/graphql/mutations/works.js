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
	// annotationDelete: {
	// 	type: RemoveType,
	// 	description: 'Remove annotation',
	// 	args: {
	// 		annotationId: {
	// 			type: new GraphQLNonNull(GraphQLID)
	// 		}
	// 	},
	// 	async resolve(parent, { annotationId }, {token}) {
	//
	// 		const annotationService = new AnnotationService({token});
	// 		return await annotationService.deleteAnnotation(annotationId);
	// 	}
	// },
	// annotationAddRevision: {
	// 	type: RemoveType,
	// 	description: 'Remove annotation',
	// 	args: {
	// 		annotationId: {
	// 			type: new GraphQLNonNull(GraphQLID)
	// 		},
	// 		revision: {
	// 			type: new GraphQLNonNull(RevisionInputType)
	// 		}
	// 	},
	// 	async resolve(parent, {annotationId, revision}, {token}) {
	// 		const annotationService = new AnnotationService({token});
	// 		return await annotationService.addRevision(annotationId, revision);
	// 	}
	// }
};

export default worksMutationFields;
