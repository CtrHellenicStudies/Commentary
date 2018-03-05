import React from 'react';

import './AddNewWork.css';


const AddNewWork = ({ toggleWorkSelectorModal }) => (
  <button
    className="addNewWork workTeaser"
    onClick={toggleWorkSelectorModal}
  >
    <i className="mdi mdi-plus addNewWorkIcon" />
    <label>
      Add new work
    </label>
  </button>
);


export default AddNewWork;
