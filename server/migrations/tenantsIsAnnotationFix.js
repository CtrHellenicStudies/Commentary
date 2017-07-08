import { Meteor } from 'meteor/meteor';
import Tenants from '/imports/api/collections/tenants';

const tenantsIsAnnotationFix = () => {
	const tenants = Tenants.find({ isAnnotation: { $exists: false } });
	if (tenants.count() > 0) {
		_.map(tenants.fetch(), (tenant) => {
			Tenants.update({ _id: tenant._id }, {
				$set: {
					isAnnotation: false,
				},
			});
		});
	}
};

export default tenantsIsAnnotationFix;
