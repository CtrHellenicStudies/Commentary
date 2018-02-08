import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import commentersQuery from '../../graphql/queries/commentersQuery';


// components
import CommenterTeaser from '../CommenterTeaser/CommenterTeaser';


class CommentersList extends Component { 
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(nextProps) {
		let commenters = [];
		const tenantId = sessionStorage.getItem('tenantId');
		const properites = {
			tenantId: tenantId
		};
		nextProps.commentersQuery.refetch(properites);
		commenters = nextProps.commentersQuery.loading ? [] : nextProps.commentersQuery.commenters;
		// SUBSCRIPTIONS:
		if (nextProps.featureOnHomepage) {
			commenters = nextProps.commentersQuery.loading ? [] : nextProps.commentersQuery.commenters
			.filter(x => x.featureOnHomepage === true);
		}
		this.setState({
			commenters: commenters
		});
	}
	render() {
		const { commenters } = this.state;
		if (!commenters) {
			return null;
		}
		return (
			<div className="commenters-list">
				{commenters.map(commenter =>
					(<CommenterTeaser
						key={commenter._id}
						commenter={commenter}
					/>)
				)}
			</div>
		);
	}
}
CommentersList.propTypes = {
	commentersQuery: PropTypes.object,
	featureOnHomepage: PropTypes.bool,
	limit: PropTypes.number
};
CommentersList.defaultProps = {
	commenters: [],
};

export default compose(commentersQuery)(CommentersList);
