import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import { commentersQuery } from '/imports/graphql/methods/commenters';

// models
import Commenters from '/imports/models/commenters';

// components
import CommenterTeaser from '/imports/ui/components/commenters/CommenterTeaser';


const CommentersList = ({ commenters }) => (
	<div className="commenters-list">
		{commenters.map(commenter =>
			(<CommenterTeaser
				key={commenter._id}
				commenter={commenter}
			/>)
		)}
	</div>
);
CommentersList.propTypes = {
	commenters: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired),
};
CommentersList.defaultProps = {
	commenters: [],
};


const cont = createContainer(({ limit, featureOnHomepage }) => {
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
export default (commentersQuery)(cont);
