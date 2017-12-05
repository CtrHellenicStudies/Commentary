import Works from '/imports/models/works';
import AdminService from '../adminService';

/**
 * Logic-layer service for dealing with works
 */
export default class WorksService extends AdminService {

	/**
	 * Rewrite subworks for modifiying works
	 * @param {(Object|Array)} subworks
	 * @returns {(Object|Array)} the new subwork
	 */
	rewriteSubworks(subworks) {
		const newSubworks = [];
		subworks.map(singleSubwork => {
			newSubworks.push({
				title: singleSubwork.title,
				slug: singleSubwork.slug,
				n: singleSubwork.n
			});
		});
		return newSubworks;
	}

	/**
	 * Create a work
	 * @param {Object} work - candidate work to create
	 * @returns {Object} newly created work
	 */
	workInsert(work) {
		if (!this.userIsNobody) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			const workId = Works.insert({...newWork});
			return Works.findOne(workId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a work
	 * @param {string} _id - id of work
	 * @param {Object} work - work to update
	 * @returns {boolean} result from mongo orm update
	 */
	workUpdate(_id, work) {
		if (!this.userIsNobody) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			return Works.update(_id, {$set: newWork});
		}
		return new Error('Not authorized');
	}

	/**
	 * Get works
	 * @param {string} _id - id of work
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of works
	 */
	worksGet(_id, tenantId) {
		const args = {};

		if (tenantId) {
			args.tenantId = tenantId;
		}

		if (_id) {
			args._id = _id;
		}
		console.log(Works.find(args, {
			sort: {
				slug: 1
			}
		}).fetch());
		return Works.find(args, {
			sort: {
				slug: 1
			}
		}).fetch();
	}

	/**
	 * Remove a work
	 * @param {string} _id - id of work
	 * @returns {boolean} result from mongo orm remove
	 */
	workRemove(_id) {
		if (!this.userIsNobody) {
			return Works.remove({ _id });
		}
		return new Error('Not authorized');
	}
}
