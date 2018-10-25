import { getVisibleSelectionRect } from 'draft-js';

import hasSelectedText from './hasSelectedText';


const handleTooltips = (props) => {
	handleTooltip(props);
	handleAddTooltip(props);
}

const getTooltipPosition = ({ top, left }) => {
	const rect = getVisibleSelectionRect(window);
	const toolbarHeight = 60;
	const toolbarWidth = 180; // make dynamic in the future

	if (rect) {
		top = rect.top - toolbarHeight + window.pageYOffset;
		left = rect.left + (rect.width / 2) - (toolbarWidth / 2);
	}

	return {
		top,
		left,
	};
}

const handleTooltip = async ({ editorState, tooltip, setTooltip }) => {
	if (hasSelectedText(editorState)) {
		await setTooltip({
			visible: true,
			position: getTooltipPosition({ ...tooltip.position }),
		});
	} else if (tooltip.visible) {
		await setTooltip({
			visible: false,
			position: getTooltipPosition({ ...tooltip.position }),
		});
	}
}

const getAddTooltipPosition = ({ top, left }) => {
	let rect = null;
	const toolbarHeight = 20;

	// get cursor position
	const selection = window.getSelection();
	if (
		selection
		&& selection.anchorNode
		&& selection.anchorNode.getBoundingClientRect
	) {
		rect = selection.anchorNode.getBoundingClientRect();
	}

	// set position from rect
	if (rect) {
		top = rect.top - (toolbarHeight / 2) + window.pageYOffset;
	}

	return {
		top,
		left,
	};
}

const handleAddTooltip = async ({ editorState, addTooltip, setAddTooltip }) => {
	const currentContent = editorState.getCurrentContent();
	const currentBlockKey = editorState.getSelection().getStartKey();
	const currentContentBlock = currentContent.getBlockForKey(currentBlockKey);
	const currentContentBlockText = currentContentBlock.getText();


	if (!currentContentBlockText) {
		await setAddTooltip({
			visible: true,
			position: getAddTooltipPosition({ ...addTooltip.position }),
		});
	} else if (addTooltip.visible) {
		await setAddTooltip({
			visible: false,
			position: getAddTooltipPosition({ ...addTooltip.position }),
		});
	}
}

export default handleTooltips;
