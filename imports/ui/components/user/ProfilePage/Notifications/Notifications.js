import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class Notifications extends React.Component {
	static propTypes = {
		subscriptions: React.PropTypes.object
	}

	render () {
		const { subscriptions } = this.props;
		
		return (
			<div className="content primary">
				<h2>Your Notifications</h2>
				<hr className="user-divider" />
				<h2>Subscriptions</h2>
				{subscriptions ?
					<h3>You are subscibed to people!</h3>
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
