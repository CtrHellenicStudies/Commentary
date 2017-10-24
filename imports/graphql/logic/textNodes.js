import { Mongo } from 'meteor/mongo';
import TextNodes from '/imports/models/textNodes';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with textNodes
 */
export default class TextNodesService extends AdminService {

	/**
	 * Create a text node
	 * @param {Object} textNode - candidate text node to create
	 * @returns {string} id of newly created text node
	 */
	textNodeCreate(textNode) {
		if (this.userIsAdmin) {
			return TextNodes.insert(textNode);
		}
		return new Error('Not authorized');
	}

	/**
	 * Get text nodes
	 * @param {string} _id - id of text node
	 * @param {string} tenantId - id of current tenant
	 * @param {number} limit - limit for mongo
	 * @param {number} skip - skip for mongo
	 * @param {string} workSlug - slug of work
	 * @param {number} subworkN - number of subwork
	 * @param {string} editionSlug - slug of edition
	 * @param {number} lineFrom - number of line that textnodes should be greater
	 *   than or equal to
	 * @param {number} lineTo - number of line that textnodes should be less than
	 *   or equal to
	 * @returns {Object[]} array of text nodes
	 */
	textNodesGet(_id, tenantId, limit, skip, workSlug, subworkN, editionSlug, lineFrom, lineTo) {
		if (this.userIsAdmin) {
			const args = {};
			const options = {
				sort: {
					'work.slug': 1,
					'text.n': 1,
				},
			};

			if (_id) {
				args._id = new Mongo.ObjectID(_id);
			}
			if (editionSlug) {
				args['text.edition.slug'] = { $regex: slugify(editionSlug), $options: 'i'};
			}
			if (lineFrom) {
				args['text.n'] = { $gte: lineFrom };
			}
			if (lineTo) {
				args['text.n'] = { $lte: lineTo };
			}

			// TODO: reinstate search for line letter and text
			// if (lineLetter) {
			// 	args['text.letter'] = lineLetter;
			// }
			// if (text) {
			// 	args['text.text'] = { $regex: text, $options: 'i'};
			// }

			if (workSlug) {
				args['work.slug'] = slugify(workSlug);
			}
			if (subworkN) {
				args['subwork.n'] = parseInt(subworkN, 10);
			}

			if (limit) {
				options.limit = limit;
			} else {
				options.limit = 100;
			}

			if (skip) {
				options.skip = skip;
			} else {
				options.skip = 0;
			}

			return TextNodes.find(args, options).fetch();
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a text node
	 * @param {string} textNodeId - id of text node
	 * @returns {boolean} result from mongo orm remove
	 */
	textNodeRemove(id) {
		if (this.userIsAdmin) {
			const removeId = new Mongo.ObjectID(id);
			return TextNodes.remove({_id: removeId});
		}
		return new Error('Not authorized');
	}
}
