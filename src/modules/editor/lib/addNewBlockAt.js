import { EditorState, ContentBlock, genKey } from 'draft-js';

/*
Used from [react-rte](https://github.com/sstur/react-rte/blob/master/src/lib/insertBlockAfter.js)
by [sstur](https://github.com/sstur)
*/
const addNewBlockAt = (
		editorState,
		pivotBlockKey,
		newBlockType = "unstyled",
		data = {}
	) => {
	const content = editorState.getCurrentContent();
	const blockMap = content.getBlockMap();
	const block = blockMap.get(pivotBlockKey);
	const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === block));
	const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest();
	const newBlockKey = genKey();

	const newBlock = new ContentBlock({
		key: newBlockKey,
		type: newBlockType,
		text: '',
		characterList: block.getCharacterList().slice(0, 0),
		depth: 0,
		data: Map(data),
	});

	const newBlockMap = blocksBefore.concat(
		[[pivotBlockKey, block], [newBlockKey, newBlock]],
		blocksAfter
	).toOrderedMap();

	const selection = editorState.getSelection();

	const newContent = content.merge({
		blockMap: newBlockMap,
		selectionBefore: selection,
		selectionAfter: selection.merge({
			anchorKey: newBlockKey,
			anchorOffset: 0,
			focusKey: newBlockKey,
			focusOffset: 0,
			isBackward: false,
		}),
	});
	return EditorState.push(editorState, newContent, 'split-block');
};

export default addNewBlockAt;
