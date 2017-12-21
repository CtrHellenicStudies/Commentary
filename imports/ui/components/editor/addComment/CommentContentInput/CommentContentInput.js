import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';
// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// components
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';


// helpers:
import linkDecorator from '/imports/ui/components/editor/addComment/LinkButton/linkDecorator';

import DraftInputEditor from '../../../shared/DraftEditorInput/DraftEditorInput';


class CommentContentInput extends React.Component {

	constructor(props) {
		super(props);
		const revisionContent = '';

		this.state = {
			contentEditorState: EditorState.createWithContent(ContentState.createFromText(revisionContent)),
			keywordSuggestions: fromJS([]),
			commentsSuggestions: fromJS([]),
			textValue: '',
			
		};
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(contentEditorState) {
		const textHtml = stateToHTML(this.state.contentEditorState.getCurrentContent());

		this.setState({
			contentEditorState,
			textValue: textHtml,
		});
	}

	render() {
		return (
			<div className="commentContentInput">
				<DraftInputEditor
					editorState={this.state.contentEditorState}
					onChange={this.onTextChange}
					placeholder="Comment text..."
					spellcheck
					ref={(element) => { this.editor = element; }}
				/>
			</div>
		);
	}
}
export default CommentContentInput;
