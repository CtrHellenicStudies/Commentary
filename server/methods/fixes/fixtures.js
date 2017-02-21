import { Meteor } from 'meteor/meteor';
import Comments from '/imports/collections/comments';
import Commenters from '/imports/collections/commenters';
import DiscussionComments from '/imports/collections/discussionComments';
import Keywords from '/imports/collections/keywords';
import ReferenceWorks from '/imports/collections/referenceWorks';
import Tenants from '/imports/collections/tenants';
import TextNodes from '/imports/collections/textNodes';
import Works from '/imports/collections/works';

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
