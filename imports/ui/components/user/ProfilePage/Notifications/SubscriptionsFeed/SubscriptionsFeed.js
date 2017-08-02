import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const SubscriptionsFeed = props => (
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
);

SubscriptionsFeed.propsType = {
	subscriptions: React.PropTypes.object
};

export default SubscriptionsFeed;
