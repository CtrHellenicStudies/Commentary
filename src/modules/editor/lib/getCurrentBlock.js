/*
 Get currentBlock in the editorState.
 via https://github.com/michelson/dante2/blob/master/src/editor/model/index.js
*/
const getCurrentBlock = (editorState) => {
	const selectionState = editorState.getSelection();
	const contentState = editorState.getCurrentContent();
	const block = contentState.getBlockForKey(selectionState.getStartKey());
	return block;
};

export default getCurrentBlock;
