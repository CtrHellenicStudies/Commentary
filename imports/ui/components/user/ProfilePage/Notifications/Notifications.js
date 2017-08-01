import React from 'react';

class Notifications extends React.Component {
	render () {
		return (
			<div>
				<h2>Your Notifications</h2>
				<hr className="user-divider" />
				<div className="user-discussion-comments" />
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
