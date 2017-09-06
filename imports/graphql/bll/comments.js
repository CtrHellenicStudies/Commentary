import AdminService from './adminService';
import Comments from '/imports/models/comments';

export default class CommentService extends AdminService {
	constructor(props) {
		super(props);
	}

	commentsGet(tenantId, limit, skip, workSlug, subworkN) {
		if (this.userIsAdmin) {
			const args = {};

			const options = {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
			};
			if ('work' in args) {
				args['work.slug'] = slugify(workSlug);
			}
			if ('subwork' in args) {
				args['subwork.n'] = subworkN;
			}

			if (tenantId) {
				args.tenantId = tenantId;
			}

			if (skip) {
				options.skip = skip;
			} else {
				options.skip = 0;
			}

			if (limit) {
				if (limit > 100) {
					options.limit = 100;
				}
				options.limit = limit;
			} else {
				options.limit = 30;
			}

			return Comments.find(args, options).fetch();
		}
		return new Error('Not authorized');
	}
}
