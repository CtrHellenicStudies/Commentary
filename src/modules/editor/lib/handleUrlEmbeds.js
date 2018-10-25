import isValidUrl from './isValidUrl';
import addNewBlock from './addNewBlock';

const handleUrlEmbeds = ({ editorState, setEditorState }) => {
	const currentContent = editorState.getCurrentContent();
	const currentBlockKey = editorState.getSelection().getStartKey();
	const currentContentBlock = currentContent.getBlockForKey(currentBlockKey);
	const currentContentBlockText = currentContentBlock.getText();


	if (isValidUrl(currentContentBlockText)) {
		const options = {
			inputUrl: currentContentBlockText,
		};

		let newEditorState;
		if (currentContentBlockText.indexOf('youtube') >= 0) {
			newEditorState = addNewBlock(editorState, 'video', options);
		} else {
			newEditorState = addNewBlock(editorState, 'embed', options);
		}

		setEditorState(newEditorState);
	}
};

export default handleUrlEmbeds;
