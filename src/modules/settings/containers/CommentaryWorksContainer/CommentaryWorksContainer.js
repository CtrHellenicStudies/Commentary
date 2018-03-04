import React from 'react';
import { compose } from 'react-apollo';

import CommentaryWorks from '../../components/CommentaryWorks';


const CommentaryWorksContainer = props => {

  let works = [];

  return (
    <CommentaryWorks
      works={works}
    />
  );
}

export default compose(

)(CommentaryWorksContainer);
