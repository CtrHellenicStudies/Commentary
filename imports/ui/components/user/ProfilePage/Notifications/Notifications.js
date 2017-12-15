import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import SubcriptionsFeed from '/imports/ui/components/user/ProfilePage/Notifications/SubscriptionsFeed';
import RecentActivity from '/imports/ui/components/user/ProfilePage/Notifications/RecentActivity';

class Notifications extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subscriptions: Meteor.user().subscriptions
		};
	}

	render () {
		const { subscriptions } = this.state;

		return (
			<div>
				{subscriptions ?
					<div>
						<RecentActivity subscriptions={subscriptions} />
						<SubcriptionsFeed subscriptions={subscriptions} />
					</div>
					:
					<h3>You have no subscriptions. Subscribe to commenters, users, and texts to recieve notifications.</h3>
				}
			</div>
		);
	}
}

export default Notifications;
