import React from 'react';
import createSingleLinePlugin from 'draft-js-single-line-plugin';

const singleLinePlugin = createSingleLinePlugin();

// titleEditorState: EditorState.createWithContent(ContentState.createFromText(revisionTitle)),
/*
onTitleChange(titleEditorState) {
	const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
	const title = jQuery(titleHtml).text();
	this.setState({
		titleEditorState,
		titleValue: title,
	});
}
*/


const TitleInput = props => (
	<h1 className="title-input">
		<Editor
			editorState={titleEditorState}
			onChange={this.onTitleChange}
			placeholder={props.placeholder}
			spellCheck
			stripPastedStyles
			plugins={[singleLinePlugin]}
			blockRenderMap={singleLinePlugin.blockRenderMap}
		/>
	</h1>
);


export default TitleInput;
