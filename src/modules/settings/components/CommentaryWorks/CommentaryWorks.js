import React from 'react';
import PropTypes from 'prop-types';

import WorkTeaser from '../../../works/components/WorkTeaser';
import AddNewWork from './AddNewWork';


import './CommentaryWorks.css';


const CommentaryWorks = ({ works, toggleWorkSelectorModal }) => (
  <div className="commentaryWorks">
    {works.map(work => (
      <WorkTeaser
        work={work}
      />
    ))}
    <AddNewWork
      toggleWorkSelectorModal={toggleWorkSelectorModal}
    />
  </div>
);

CommentaryWorks.propTypes = {
  works: PropTypes.array,
  toggleWorkSelectorModal: PropTypes.func,
};


export default CommentaryWorks;
