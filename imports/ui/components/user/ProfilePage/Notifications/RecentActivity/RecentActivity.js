import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

class RecentActivity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notifications: this.props.subscriptions.notifications
		};

		this.removeNotification = this.removeNotification.bind(this);
	}

	static propTypes = {
		subscriptions: PropTypes.object
	}

	removeNotification(notification) {
		const { notifications } = this.state;

		const notificationID = notification._id;

		Meteor.users.update({_id: Meteor.userId()}, {
			$pull: {
				'subscriptions.notifications': {_id: notificationID}
			}
		});

		this.setState({
			notifications: notifications.filter(notificationToFilter => notificationToFilter._id !== notificationID)
		});
	}

	render() {
		const { notifications } = this.state;
		return (
			<div>
				<h2>Recent Activity</h2>
				{notifications.length > 0 ?
					<div>
						{notifications.map((notification) => (
							<Card key={notification._id}>
								<Link to={`/commentary?_id=${notification.slug}`}>
									<CardHeader
										title={`New notification from ${moment(notification.created).format('D/M/YYYY')}`}
										subtitle={notification.message}
										avatar={notification.avatar.src}
									/>
								</Link>
								<FlatButton
									label="Remove Notification"
									onClick={() => this.removeNotification(notification)}
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
