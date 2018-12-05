import { getVisibleSelectionRect } from 'draft-js';


// heavily influenced by
// https://github.com/draft-js-plugins/draft-js-plugins/blob/9975f41d7f0533843882e5bf4e483081c17f7d12/draft-js-inline-toolbar-plugin/src/components/Toolbar/index.js#L64-L89
export const getTooltipPosition = (editorRef, { top, left }) => {
	const selectionRect = getVisibleSelectionRect(window);
	const editorRoot = editorRef.current.editorContainer.parentNode;
	const editorRootRect = editorRoot.getBoundingClientRect();
	const toolbarHeight = 60;

	if (selectionRect) {
		top = (editorRoot.offsetTop - toolbarHeight)
      + (selectionRect.top - editorRootRect.top);

		left = editorRoot.offsetLeft
      + (selectionRect.left - editorRootRect.left)
      + (selectionRect.width / 2);
	}

	return {
		top,
		left,
	};
}

const clickedOnTooltip = evt => {
	const className = evt.target.parentNode.className;

	// NOTE: (charles) These are possible className targets for
	// the user to click, after which clicks we don't want to
	// to hide the tooltip. There is probably a better way to
	// handle these clicks, but because the DOM contents of
	// the tooltip change, it was difficult to find a target
	// node for reliably canceling the hiding function

	return [
		'formattingTooltipItemButton',
		'linkTextInput'
	].some(s => className.indexOf(s) > -1);
};

export const showTooltip = (tooltip, editorRef, fn) => {
	const updatedTooltip = {
		...tooltip,
		position: getTooltipPosition(editorRef, tooltip.position),
		visible: true,
	};

	const hideTooltip = evt => {
		if (clickedOnTooltip(evt)) {
			evt.preventDefault();
			evt.stopPropagation();
			return;
		}

		window.removeEventListener('click', hideTooltip);
		fn({
			...updatedTooltip,
			visible: false,
		});
	};

	fn(updatedTooltip);
	window.addEventListener('click', hideTooltip);
};

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

export const handleAddTooltip = async ({ editorState, addTooltip, setAddTooltip }) => {
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
