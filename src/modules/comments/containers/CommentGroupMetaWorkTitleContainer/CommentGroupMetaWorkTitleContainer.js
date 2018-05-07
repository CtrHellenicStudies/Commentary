import React from 'react';
import { compose } from 'react-apollo';

import workTitleQuery from '../../graphql/queries/workTitle';



const CommentGroupMetaWorkTitleContainer = props => {
  let title = '';


  if (
      props.workTitleQuery
    && props.workTitleQuery.works
    && props.workTitleQuery.works.length
  ) {
    title = props.workTitleQuery.works[0].title;
  }


  return (
    <CommentGroupMetaWorkTitle
      title={title}
    />
  );
};

export default compose(
  workTitleQuery,
)(CommentGroupMetaWorkTitleContainer);
