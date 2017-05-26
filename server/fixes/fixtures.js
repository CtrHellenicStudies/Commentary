import { Meteor } from 'meteor/meteor';
import Comments from '/imports/api/collections/comments';
import Commenters from '/imports/api/collections/commenters';
import DiscussionComments from '/imports/api/collections/discussionComments';
import Keywords from '/imports/api/collections/keywords';
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import Tenants from '/imports/api/collections/tenants';
import TextNodes from '/imports/api/collections/textNodes';
import Works from '/imports/api/collections/works';

Meteor.startup(() => {
	if (Tenants.find().count() === 0) {
		const tenantId = Tenants.insert({
			subdomain: 'homer',
		});

		Commenters.update({}, {
			$set: {
				tenantId,
			},
		});

		Comments.update({}, {
			$set: {
				tenantId,
			},
		});

		DiscussionComments.update({}, {
			$set: {
				tenantId,
			},
		});

		Keywords.update({}, {
			$set: {
				tenantId,
			},
		});

		ReferenceWorks.update({}, {
			$set: {
				tenantId,
			},
		});

		TextNodes.update({}, {
			$set: {
				tenantId,
			},
		});

		Works.update({}, {
			$set: {
				tenantId,
			},
		});
	}
});
