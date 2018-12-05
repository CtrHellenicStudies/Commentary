import React from 'react';

import './AddTooltipMenuItemButton.css';


const AddTooltipMenuItemButton = props => (
	<button
		className={`addTooltipMenuItemButton ${props.className}`}
		onClick={props.onClick}
	>
		{props.children}
	</button>
);

export default AddTooltipMenuItemButton;
