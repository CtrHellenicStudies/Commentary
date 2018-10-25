import React from 'react';

import './AddTooltipButton.css';


const AddTooltipButton = props => (
	<button
		className={`addTooltipButton ${props.className}`}
		onClick={props.onClick}
	>
		{props.children}
	</button>
);


export default AddTooltipButton;
