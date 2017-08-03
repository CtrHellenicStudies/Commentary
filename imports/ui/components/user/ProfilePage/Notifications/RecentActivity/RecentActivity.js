import React from 'react';

class RecentActivity extends React.Component {
	constructor(props) {
		super(props);

		this.removeNotification = this.removeNotification.bind(this);
	}

	removeNotification() {

	}

	render() {
		return (
			<div>
				<h2>Recent Activity</h2>
			</div>
		);
	}
}

export default RecentActivity;
