import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class RecentActivity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notifications: this.props.subscriptions.notifications
		};

		this.removeNotification = this.removeNotification.bind(this);
	}

	static propTypes = {
		subscriptions: React.PropTypes.object
	}

	removeNotification(notification) {
		const { notifications } = this.state;
		console.log(notifications);
	}

	render() {
		const { notifications } = this.state;
		return (
			<div>
				<h2>Recent Activity</h2>
				{notifications && notifications.length > 0 ?
					<div>
						{notifications.map((notification) => (
							<Card key={notification._id}>
								<a>
									<CardHeader
										subtitle={notification.message}
										avatar={notification.avatar.src}
									/>
								</a>
								<FlatButton
									label="Remove Notification"
									onTouchTap={this.removeNotification(notification)}
								/>
							</Card>
						))}
					</div>
				:
					<div>
						<h3>You have no new notifications.</h3>
					</div>
				}
			</div>
		);
	}
}

export default RecentActivity;
