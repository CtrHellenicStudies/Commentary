import TextNodes from '/imports/models/textNodes';
import AdminService from './adminService';
import { Mongo } from 'meteor/mongo';

export default class TextNodesService extends AdminService {
	constructor(props) {
		super(props);
	}

	textNodeCreate(textNode) {
		if (this.userIsAdmin) {
			return TextNodes.insert(textNode);
		}
		return new Error('Not authorized');
	}

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

	textNodeRemove(id) {
		if (this.userIsAdmin) {
			const removeId = new Mongo.ObjectID(id);
			return TextNodes.remove({_id: removeId});
		}
		return new Error('Not authorized');
	}
}
