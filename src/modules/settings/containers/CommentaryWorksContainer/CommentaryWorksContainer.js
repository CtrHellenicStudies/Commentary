import React from 'react';
import { compose } from 'react-apollo';

import CommentaryWorks from '../../components/CommentaryWorks';


const CommentaryWorksContainer = ({ works, toggleWorkSelectorModal, handleSelectWork }) => {
  console.log('works', works);
  return (
    <CommentaryWorks
      works={works}
      toggleWorkSelectorModal={toggleWorkSelectorModal}
      handleSelectWork={handleSelectWork}
    />
  );
}

export default CommentaryWorksContainer;
