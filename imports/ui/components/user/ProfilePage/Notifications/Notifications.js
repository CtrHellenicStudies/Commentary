import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import SubcriptionsFeed from '/imports/ui/components/user/ProfilePage/Notifications/SubscriptionsFeed';

class Notifications extends React.Component {
	static propTypes = {
		subscriptions: React.PropTypes.object
	}

	render () {
		const { subscriptions } = this.props;
		
		return (
			<div>
				<h2>Recent Activity</h2>
				<hr className="user-divider" />
				<h2>Subscriptions</h2>
				{subscriptions ?
					<SubcriptionsFeed subscriptions={subscriptions} />
					:
					<h3>You have no subscriptions</h3>
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
