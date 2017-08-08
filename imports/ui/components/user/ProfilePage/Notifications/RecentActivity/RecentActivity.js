import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class RecentActivity extends React.Component {
	constructor(props) {
		super(props);

		this.removeNotification = this.removeNotification.bind(this);
	}


	removeNotification() {
		console.log('remove me!');
	}

	render() {
		const { subscriptions } = this.props;
		return (
			<div>
				<h2>Recent Activity</h2>
				{subscriptions.notifications.map((notification) => (
					<Card key={notification._id}>
						<a>
							<CardHeader
								subtitle={notification.message}
								avatar={notification.avatar.src}
							/>
						</a>
						<FlatButton
							label="Remove Notification"
							onTouchTap={this.removeNotification}
						/>
					</Card>
				))}
			</div>
		);
	}
}

export default RecentActivity;
