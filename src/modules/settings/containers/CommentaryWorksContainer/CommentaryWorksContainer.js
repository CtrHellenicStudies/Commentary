import React from 'react';
import { compose } from 'react-apollo';

import CommentaryWorks from '../../components/CommentaryWorks';


const CommentaryWorksContainer = ({ toggleWorkSelectorModal, worksQuery }) => {

  let works = [];

  return (
    <CommentaryWorks
      works={works}
      toggleWorkSelectorModal={toggleWorkSelectorModal}
    />
  );
}

export default compose(

)(CommentaryWorksContainer);
