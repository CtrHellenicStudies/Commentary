import React from 'react';

import TooltipItem from '../TooltipItem';
import TooltipLink from '../TooltipLink';


const TooltipButtons = () => (
	<div className="tooltipButtons">
		<TooltipItem
			icon="format-title"
			blockType="header-one"
		/>
		<TooltipItem
			icon="format-bold"
			inlineStyle="BOLD"
		/>
		<TooltipItem
			icon="format-italic"
			inlineStyle="ITALIC"
		/>
		<TooltipItem
			icon="format-underline"
			inlineStyle="UNDERLINE"
		/>
		<TooltipLink />
	</div>
);

export default TooltipButtons;
