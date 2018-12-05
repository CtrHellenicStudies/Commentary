import {
	EditorState,
} from 'draft-js';

import getCurrentBlock from './getCurrentBlock';

import decorators from '../components/decorators';

/*
Adds a new block (currently replaces an empty block) at the current cursor position
of the given `newType`.
Via https://github.com/michelson/dante2/blob/master/src/editor/model/index.js
*/
const addNewBlock = (editorState, newType = "unstyled", data = {}) => {
	const selectionState = editorState.getSelection();
	if (!selectionState.isCollapsed()) {
		return editorState;
	}

	const contentState = editorState.getCurrentContent();
	const key = selectionState.getStartKey();
	const blockMap = contentState.getBlockMap();
	const currentBlock = getCurrentBlock(editorState);
	if (!currentBlock) {
		return editorState;
	}

	if (currentBlock.getLength() === 0) {
		if (currentBlock.getType() === newType) {
			return editorState;
		}

		const newBlock = currentBlock.merge({
			type: newType,
			data,
		});

		const newContentState = contentState.merge({
			blockMap: blockMap.set(key, newBlock),
			selectionAfter: selectionState,
		});

		// TODO: investigate why editorstate.push isn't working
		// return EditorState.push(editorState, newContentState, 'change-block-type');
		const newEditorState = EditorState.createWithContent(newContentState, decorators);

		return newEditorState;
	}

	return editorState;
};

export default addNewBlock;
