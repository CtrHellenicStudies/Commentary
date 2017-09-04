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
}
