import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import commentersQuery from '../../graphql/queries/commentersQuery';

// components
import CommenterTeaser from '../CommenterTeaser/CommenterTeaser';

import './CommenterList.css'


class CommenterList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(nextProps) {
		let commenters = [];
		const { tenantId } = this.props;

		// TODO: move refetch to container
		nextProps.commentersQuery.refetch({ tenantId });
		commenters = nextProps.commentersQuery.loading ? [] : nextProps.commentersQuery.commenters;
		if (nextProps.featureOnHomepage) {
			commenters = nextProps.commentersQuery.loading ? [] : nextProps.commentersQuery.commenters
				.filter(x => x.featureOnHomepage === true);
		}

		this.setState({
			commenters,
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

CommenterList.propTypes = {
	commentersQuery: PropTypes.object,
	featureOnHomepage: PropTypes.bool,
	limit: PropTypes.number
};

CommenterList.defaultProps = {
	commenters: [],
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
)(CommenterList);
