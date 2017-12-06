import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import { commentersQuery } from '/imports/graphql/methods/commenters';
import Utils from '/imports/lib/utils';

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
	const tenantId = sessionStorage.getItem('tenantId');
	const properites = {
		tenantId: tenantId
	};
	if (props.limit) {
		_limit = props.limit;
	}
	if (tenantId && Utils.shouldRefetchQuery(properites, props.commentersQuery.variables)) {
		props.commentersQuery.refetch(properites);
	}
	commenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters;
	// SUBSCRIPTIONS:
	if (props.featureOnHomepage) {
		commenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters
		.filter(x => x.featureOnHomepage === true);
	}

	return {
		commenters,
	};
}, CommentersList);
export default compose(commentersQuery)(cont);
