import { GraphQLString, GraphQLNonNull } from 'graphql';
// types
import { PageType, PageInputType} from '/imports/graphql/types/models/page';
import { RemoveType } from '/imports/graphql/types/index';

// bll
import PagesService from '../bll/pages';

const pagesMutationFields = {
	pageRemove: {
		type: RemoveType,
		description: 'Remove a single page',
		args: {
			pageId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {pageId}, {token}) {
			const pagesService = new PagesService({token});
			return await pagesService.pageRemove(pageId);
		}
	},
	pageUpdate: {
		type: PageType,
		description: 'Update a single page',
		args: {
			pageId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			page: {
				type: new GraphQLNonNull(PageInputType)
			}
		},
		async resolve(parent, {pageId, page}, {token}) {
			const pagesService = new PagesService({token});
			return await pagesService.pageUpdate(pageId, page);
		}
	},
	pageCreate: {
		type: PageType,
		description: 'Create a page',
		args: {
			page: {
				type: PageInputType
			}
		},
		async resolve(parent, {page}, {token}) {
			const pagesService = new PagesService({token});
			return await pagesService.pageCreate(page);
		}
	}
};

export default pagesMutationFields;
