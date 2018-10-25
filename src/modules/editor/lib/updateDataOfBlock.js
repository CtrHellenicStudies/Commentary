import { EditorState } from 'draft-js';

import decorators from '../components/decorators';

/*
Update block-level metadata of the given `block` to the `newData`/
via https://github.com/michelson/dante2/blob/master/src/editor/model/index.js
*/
const updateDataOfBlock = (editorState, block, newData) => {
	const contentState = editorState.getCurrentContent();
	const newBlock = block.merge({
		data: newData,
	});
	const newContentState = contentState.merge({
		blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
	});
	// TODO: investigate why editorstate.push isn't working
	// return EditorState.push(editorState, newContentState, 'change-block-type');
	const newEditorState = EditorState.createWithContent(newContentState, decorators);

	return newEditorState;
};

export default updateDataOfBlock;
