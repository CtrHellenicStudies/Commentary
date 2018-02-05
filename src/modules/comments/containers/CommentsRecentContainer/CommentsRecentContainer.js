import React from 'react';
import { compose } from 'react-apollo';

// graphql
import commentsRecentQuery from '../../graphql/queries/commentsRecent';

// lib
import parseCommentsToCommentGroups from '../../lib/parseCommentsToCommentGroups';



class CommentsRecentContainer extends React.Component {

  render() {
		let comments = [];

    if (
        this.props.commentsRecentQuery
      && this.props.commentsRecentQuery.comments
    ) {
      comments = this.props.commentsRecentQuery.comments;
    }

    return (
      <CommentsRecent
        comments={comments}
      />
    );
  }
}

export default compose(
  commentsRecentQuery,
)(CommentsRecentContainer);
