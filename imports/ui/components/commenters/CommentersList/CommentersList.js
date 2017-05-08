import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Commenters from '/imports/api/collections/commenters';

// components
import CommenterTeaser from '/imports/ui/components/commenters/CommenterTeaser';


const CommentersList = ({ commenters }) => (
	<div className="commenters-list">
		{commenters.map(commenter =>
			<CommenterTeaser
				key={commenter._id}
				commenter={commenter}
			/>
		)}
	</div>
);
CommentersList.propTypes = {
	// limit: React.PropTypes.number,
	// featureOnHomepage: React.PropTypes.bool,
	commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
	}).isRequired),
};
CommentersList.defaultProps = {
	// limit: null,
	// featureOnHomepage: false,
	commenters: [],
};


export default createContainer(({ limit, featureOnHomepage }) => {
	let commenters = [];
	let _limit = 100;
	if (limit) {
		_limit = limit;
	}

	// SUBSCRIPTIONS:
	if (featureOnHomepage) {
		Meteor.subscribe('commenters.featureOnHomepage', Session.get('tenantId'), _limit);
		commenters = Commenters.find({
			featureOnHomepage: true,
		}, {
			sort: {
				name: 1,
			},
			_limit,
		}).fetch();
	} else {
		Meteor.subscribe('commenters', Session.get('tenantId'), _limit);
		commenters = Commenters.find({}, { sort: { name: 1 }, _limit }).fetch();
	}

	return {
		commenters,
	};
}, CommentersList);
