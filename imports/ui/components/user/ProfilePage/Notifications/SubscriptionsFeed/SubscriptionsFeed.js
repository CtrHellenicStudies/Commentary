import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

const SubscriptionsFeed = props => (
	<div>
		<h2>Subscriptions</h2>
		{props.subscriptions.commenters.length > 0 ?
			<div>
				{props.subscriptions.commenters.map(commenter => (
					<Card key={commenter._id}>
						<a href={`/commenters/${commenter.slug}`}>
							<CardHeader
								title={commenter.name}
								subtitle={commenter.tagline}
								avatar={commenter.avatar.src}
							/>
						</a>
					</Card>
			))}
			</div>
			:
			<h3>You have no subscriptions. Visit a commenter's page to subscribe.</h3>
		}

	</div>
);

SubscriptionsFeed.propTypes = {
	subscriptions: React.PropTypes.object
};

export default SubscriptionsFeed;
