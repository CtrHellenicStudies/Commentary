import { Mongo } from 'meteor/mongo';
import TextNodes from '/imports/models/textNodes';
import slugify from 'slugify';
import GraphQLService from '../graphQLService';

/**
 * Logic-layer service for dealing with textNodes
 */
export default class TextNodesService extends GraphQLService {

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
	 * Update textNode
	 * @param {String} id 
	 * @param {String} editionId 
	 * @param {String} updatedText 
	 * @param {Int} updatedTextN 
	 */
	textNodeUpdate(id, editionId, updatedText, updatedTextN) {
		if (this.userIsNobody) {
			throw new Error('not-authorized');
		}
		const textNode = TextNodes.findOne({ _id: id });
		if (!textNode) {
			throw new Error('text-editor', 'Unable to update text for provided text node ID');
		}
	
		const textNodeTextValues = textNode.text.slice();
		textNodeTextValues.forEach(textValue => {
			if (textValue.edition === editionId) {
				textValue.html = updatedText;
				textValue.n = updatedTextN;
				textValue.text = stripTags(updatedText);
			}
		});
	
		return TextNodes.update({
			_id: id,
		}, {
			$set: {
				text: textNodeTextValues,
			},
		});
	}
	/**
	 * Get text nodes
	 * @param {string} _id - id of text node
	 * @param {string} tenantId - id of current tenant
	 * @param {number} limit - limit for mongo
	 * @param {number} skip - skip for mongo
	 * @param {string} workSlug - slug of work
	 * @param {number} subworkN - number of subwork
	 * @param {string} editionId - id of edition
	 * @param {number} lineFrom - number of line that textnodes should be greater
	 *   than or equal to
	 * @param {number} lineTo - number of line that textnodes should be less than
	 *   or equal to
	 * @returns {Object[]} array of text nodes
	 */
	textNodesGet(_id, tenantId, limit, skip, workSlug, subworkN, editionId, lineFrom, lineTo) {
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
		if (editionId) {
			args['text.edition'] = editionId;
		}
		if (lineFrom) {
			args['text.n'] = { $gte: lineFrom };
		}
		if (lineTo) {
			args.$and = [{'text.n': { $gte: lineFrom }}, {'text.n': { $lte: lineTo }}];
		}

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
		console.log(lineFrom, ' ', lineTo, ' ', TextNodes.find(args, options).fetch().length);
		return TextNodes.find(args, options).fetch();
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
	/**
	 * Get max line
	 * @param {String} workSlug 
	 * @param {Number} subworkN 
	 */
	getMaxLine(workSlug, subworkN) {

		let maxLine = 0;
		
		if (workSlug === 'homeric-hymns') {
			workSlug = 'hymns';
		}
	
		const _maxLine = TextNodes.aggregate([{
			$match: {
				'work.slug': workSlug,
				'subwork.n': subworkN,
			},
		}, {
			$group: {
				_id: 'maxLine',
				maxLine: {
					$max: '$text.n',
				},
			},
		}]);
	
		if (_maxLine && _maxLine.length) {
			maxLine = _maxLine[0].maxLine[0]; // granted that all text.editions have the same max line number
		}
	
		return maxLine;
	
	}
}
