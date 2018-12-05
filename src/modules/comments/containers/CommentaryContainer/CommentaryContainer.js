import React from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router';
import qs from 'qs-lite';
import autoBind from 'react-autobind';

// graphql
import commentsQuery from '../../graphql/queries/comments';
import commentsMoreQuery from '../../graphql/queries/commentsMore';

// components
import Commentary from '../../components/Commentary';

// lib
import parseCommentsToCommentGroups from '../../lib/parseCommentsToCommentGroups';


class CommentaryContainer extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	loadMoreComments() {
		const queryParams = qs.parse(window.location.search.replace('?', ''));
		if (
			typeof queryParams.page !== 'undefined'
			&& queryParams.page !== null
		) {
			queryParams.page = parseInt(queryParams.page, 10) + 1;
		} else {
			queryParams.page = 1;
		}

		// update route
		const urlParams = qs.stringify(queryParams);
		this.props.history.push(`${window.location.pathname}?${urlParams}`);
	}

	render() {
		const { filters, isOnHomeView, skip, limit, queryParams } = this.props;
		let commentGroups = [];

		if (!isOnHomeView) {
			if (
				this.props.commentsQuery.loading
        || this.props.commentsMoreQuery.loading
			) {
				return (
					<div className="commentary-primary content ">
						<div className="ahcip-spinner commentary-loading">
							<div className="double-bounce1" />
							<div className="double-bounce2" />
						</div>
					</div>
				);
			}

			if (
				!this.props.commentsMoreQuery.commentsMore
				&& !this.props.commentsQuery.comments
			) {
				return (
					<div className="commentary-primary content ">
						<div className="no-commentary-wrap">
							<p className="no-commentary no-results">
  							No commentary available for the current search.
  						</p>
						</div>
					</div>
				);
			}
		}

		if (
			this.props.commentsQuery
      && this.props.commentsQuery.comments
		) {
			commentGroups = parseCommentsToCommentGroups(this.props.commentsQuery.comments);
		}


		return (
			<Commentary
				commentGroups={commentGroups}
				filters={filters}
				showLoginModal={this.showLoginModal}
				loadMoreComments={this.loadMoreComments}
				skip={skip}
				limit={limit}
				queryParams={queryParams}
			/>
		);
	}
}

export default compose(
	commentsQuery,
	commentsMoreQuery,
	withRouter,
)(CommentaryContainer);
