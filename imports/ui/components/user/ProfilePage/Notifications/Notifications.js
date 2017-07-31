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

export default Notifications;
