import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';

// types
import { PageType } from '/imports/graphql/types/models/page';

// logic
import PageService from '../logic/pages';

const pagesQueryFields = {
	pages: {
		type: new GraphQLList(PageType),
		description: 'Get list of all pages',
		args: {
			tenantId: {
				type: GraphQLID,
			},
			_id: {
				type: GraphQLString
			}
		},
		async resolve(parent, { _id, tenantId }, {token}) {
			const pageService = new PageService({token});
			return await pageService.pagesGet(_id, tenantId);
		}
	},
};

export default pagesQueryFields;
