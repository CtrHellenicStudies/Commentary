import { GraphQLID, GraphQLList } from 'graphql';

// types
import { PageType } from '/imports/graphql/types/models/page';

// bll
import PageService from '../bll/pages';

const pagesQueryFields = {
	pages: {
		type: new GraphQLList(PageType),
		description: 'Get list of all pages',
		args: {
			tenantId: {
				type: GraphQLID,
			}
		},
		async resolve(parent, { tenantId }, {token}) {
			const pageService = new PageService({token});
			return await pageService.pagesGet(tenantId);
		}
	},
};

export default pagesQueryFields;
