import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import DraftInputEditor from '../../../shared/DraftEditorInput/DraftEditorInput';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// models
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import TagsInput from '/imports/ui/components/editor/addComment/TagsInput';
import CommentRevisionSelect from '/imports/ui/components/commentary/comments/CommentRevisionSelect';

// lib:
import muiTheme from '/imports/lib/muiTheme';

// helpers:
import linkDecorator from '/imports/ui/components/editor/addComment/LinkButton/linkDecorator';





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

CommentContentInput.propTypes = {
	tags: PropTypes.array,
};

const CommentContentInputContainer = createContainer(() => {
	Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });
	const tags = Keywords.find().fetch();

	return {
		tags,
	};

}, CommentContentInput);

export default CommentContentInputContainer;
