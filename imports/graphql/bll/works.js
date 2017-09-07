import Works from '/imports/models/works';
import AdminService from './adminService';

export default class WorksService extends AdminService {
	constructor(props) {
		super(props);
	}

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

	workInsert(work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			const workId = Works.insert({...newWork});
			return Works.findOne(workId);
		}
		return new Error('Not authorized');
	}

	workUpdate(_id, work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			return Works.update(_id, {$set: newWork});
		}
		return new Error('Not authorized');
	}

	worksGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			if (_id) {
				args._id = _id;
			}

			return Works.find(args, {
				sort: {
					slug: 1
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}
}
