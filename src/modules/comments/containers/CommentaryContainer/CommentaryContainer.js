import React from 'react';
import { compose } from 'react-apollo';

// graphql
import commentsQuery from '../../graphql/queries/comments';
import commentsMoreQuery from '../../graphql/queries/commentsMore';
import { editionsQuery } from '../../../../graphql/methods/editions';

// components
import Commentary from '../../components/Commentary';

// lib
import parseCommentsToCommentGroups from '../../lib/parseCommentsToCommentGroups';


class CommentaryContainer extends React.Component {

  render() {
		const {
      filters, toggleSearchTerm, showLoginModal, loadMoreComments, isOnHomeView,
      skip, limit, queryParams,
    } = this.props;
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

      if (!this.props.commentsMoreQuery.commentsMore) {
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
				toggleSearchTerm={this.props.toggleSearchTerm}
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
)(CommentaryContainer);
