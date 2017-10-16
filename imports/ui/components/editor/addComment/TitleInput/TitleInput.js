import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
} from 'draft-js-buttons';
import createSingleLinePlugin from 'draft-js-single-line-plugin';

const singleLinePlugin = createSingleLinePlugin();


class TitleInput extends React.Component {

	constructor(props) {
		super(props);
		const revisionTitle = '';

		this.state = {
			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revisionTitle)),
		};

		this.onTitleChange = this.onTitleChange.bind(this);
	}

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	}

	render() {
		return (
			<h1 className="title-input">
				<Editor
					editorState={this.state.titleEditorState}
					onChange={this.onTitleChange}
					placeholder={this.props.placeholder}
					spellCheck
					stripPastedStyles
					plugins={[singleLinePlugin]}
					blockRenderMap={singleLinePlugin.blockRenderMap}
				/>
			</h1>
		);
	}
}

TitleInput.propTypes = {
	placeholder: PropTypes.string,
};

TitleInput.defaultProps = {
	placeholder: 'Title . . .',
};


export default TitleInput;
