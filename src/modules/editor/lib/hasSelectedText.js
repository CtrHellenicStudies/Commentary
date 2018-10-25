import draftJsBlockTypes from './draftJsBlockTypes';

const hasSelectedText = (editorState) => {
	let hasTextSelected = false;

	const selectionState = editorState.getSelection();
	const anchorKey = selectionState.getAnchorKey();
	const currentContent = editorState.getCurrentContent();
	const currentContentBlock = currentContent.getBlockForKey(anchorKey);
	const start = selectionState.getStartOffset();
	const end = selectionState.getEndOffset();
	const selectedText = currentContentBlock.getText().slice(start, end);

	if (
		selectedText
		&& selectedText.length
		&& !selectionState.isCollapsed()
		&& (currentContentBlock.getType()).indexOf(draftJsBlockTypes) <= 0
	) {
		hasTextSelected = true;
	}

	return hasTextSelected;
}

export default hasSelectedText;
