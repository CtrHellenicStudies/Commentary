import React from 'react';

import FormattingTooltipItem from '../FormattingTooltipItem';
import FormattingTooltipLink from '../FormattingTooltipLink';

const FormattingTooltipButtons = () => (
	<div className="formattingTooltipButtons">
		<FormattingTooltipItem
			icon="format-title"
			blockType="header-one"
		/>
		<FormattingTooltipItem
			icon="format-title"
			blockType="header-two"
		/>
		<FormattingTooltipItem
			icon="format-bold"
			inlineStyle="BOLD"
		/>
		<FormattingTooltipItem
			icon="format-italic"
			inlineStyle="ITALIC"
		/>
		<FormattingTooltipItem
			icon="format-blockquote"
			inlineStyle="BLOCKQUOTE"
		/>
		<FormattingTooltipLink />
	</div>
);

export default FormattingTooltipButtons;
