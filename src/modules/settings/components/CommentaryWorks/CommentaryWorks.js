import React from 'react';
import PropTypes from 'prop-types';

import WorkTeaser from '../../../works/components/WorkTeaser';
import AddNewWork from './AddNewWork';


import './CommentaryWorks.css';


const CommentaryWorks = ({ works, toggleWorkSelectorModal, handleSelectWork }) => (
  <div className="commentaryWorks">
    {works.map(work => (
      <WorkTeaser
        key={work.id}
        work={work}
        handleSelectWork={handleSelectWork}
      />
    ))}
    <AddNewWork
      toggleWorkSelectorModal={toggleWorkSelectorModal}
    />
  </div>
);

CommentaryWorks.defaultProps = {
  works: [],
};

CommentaryWorks.propTypes = {
  works: PropTypes.array,
  toggleWorkSelectorModal: PropTypes.func,
};


export default CommentaryWorks;
