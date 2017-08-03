import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import SubcriptionsFeed from '/imports/ui/components/user/ProfilePage/Notifications/SubscriptionsFeed';
import RecentActivity from '/imports/ui/components/user/ProfilePage/Notifications/RecentActivity';

class Notifications extends React.Component {
	static propTypes = {
		subscriptions: React.PropTypes.object
	}

	render () {
		const { subscriptions } = this.props;
		
		return (
			<div>
				{subscriptions ?
					<div>
						<RecentActivity />
						<SubcriptionsFeed subscriptions={subscriptions} />
					</div>
					:
					<h3>You have no subscriptions. Subscribe to commenters, users, and texts to recieve notifications.</h3>
				}
			</div>
		);
	}
}

const NotificationsContainer = createContainer(() => {
	const subscriptions = Meteor.user().subscriptions;
	return {
		subscriptions
	};
}, Notifications);

export default NotificationsContainer;
