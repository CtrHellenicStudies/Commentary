import React from 'react';

import './AddTooltipButton.css';


const AddTooltipButton = props => (
	<button
		className={`addTooltipButton ${props.className}`}
		onClick={props.onClick}
	>
		<div className="addTooltipInner">
			{props.children}
		</div>
	</button>
);


export default AddTooltipButton;
