import React from 'react';

import './TooltipItemButton.css';


const TooltipItemButton = props => (
	<button
		className={`tooltipItemButton ${props.className}`}
		onClick={props.onClick}
	>
		{props.children}
	</button>
);


export default TooltipItemButton;
