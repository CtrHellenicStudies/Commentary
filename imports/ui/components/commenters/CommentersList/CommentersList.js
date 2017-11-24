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


const cont = createContainer(props => {
	let commenters = [];
	let _limit = 100;
	if (props.limit) {
		_limit = props.limit;
	}

	// SUBSCRIPTIONS:
	if (props.featureOnHomepage) {
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
		props.commentersQuery.refetch({
			tenantId: Session.get('tenantId')
		});
		commenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters;
	}

	return {
		commenters,
	};
}, CommentersList);
export default compose(commentersQuery)(cont);
