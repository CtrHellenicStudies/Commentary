import React from 'react';

import './FormattingTooltipItemButton.css';


const FormattingTooltipItemButton = props => (
	<button
		className={`formattingTooltipItemButton ${props.className}`}
		onClick={props.onClick}
	>
		{props.children}
	</button>
);


export default FormattingTooltipItemButton;
