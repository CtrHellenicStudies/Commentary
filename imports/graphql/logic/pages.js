import Pages from '/imports/models/pages';
import GraphQLService from './graphQLService';

/**
 * Logic-layer service for dealing with pages
 */
export default class PageService extends GraphQLService {

	/**
	 * Get pages
	 * @param {string} _id - id of page
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of pages
	 */
	pagesGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}
			if (_id) {
				args._id = _id;
			}
			return Pages.find(args).fetch();
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a page
	 * @param {string} _id - id of page
	 * @param {Object} page - page params to update
	 * @returns {boolean} result of mongo orm update
	 */
	pageUpdate(_id, page) {
		if (this.userIsAdmin) {
			return Pages.update(_id, {$set: page});
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a page
	 * @param {string} pageId - id of page to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	pageRemove(pageId) {
		if (this.userIsAdmin) {
			return Pages.remove({_id: pageId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a new page
	 * @param {Object} page - new page candidate
	 * @returns {Object} the new page that was created
	 */
	pageCreate(page) {
		if (this.userIsAdmin) {
			const pageId = Pages.insert({...page});
			return Pages.findOne(pageId);
		}
		return new Error('Not authorized');
	}
}
