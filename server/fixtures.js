import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import DiscussionComments from '/imports/models/discussionComments';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';
import Tenants from '/imports/models/tenants';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

Meteor.startup(() => {
	// start cron tasks
	SyncedCron.start();

	if (Tenants.find().count() === 0) {
		const tenantId = Tenants.insert({
			subdomain: 'ahcip',
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
