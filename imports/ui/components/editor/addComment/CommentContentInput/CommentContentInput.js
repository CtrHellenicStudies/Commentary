import React from 'react';

import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
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

// api
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// components
import { ListGroupDnD, creatListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import TagsInput from '/imports/ui/components/editor/addComment/TagsInput';
import CommentRevisionSelect from '/imports/ui/components/commentary/comments/CommentRevisionSelect';

// lib:
import muiTheme from '/imports/lib/muiTheme';

// helpers:
import linkDecorator from '/imports/ui/components/editor/addComment/LinkButton/linkDecorator';


// Create toolbar plugin for editor
const singleLinePlugin = createSingleLinePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
	structure: [
		BoldButton,
		ItalicButton,
		UnderlineButton,
		Separator,
		UnorderedListButton,
		OrderedListButton,
		BlockquoteButton,
		LinkButton,
	]
});
const { InlineToolbar } = inlineToolbarPlugin;

// Keyword Mentions
const keywordMentionPlugin = createMentionPlugin();

// Comments Cross Reference Mentions
const commentsMentionPlugin = createMentionPlugin({
	mentionTrigger: '#',
});



class CommentContentInput extends React.Component {


	render() {
		return (
			<div className="commentContentInput">
				<Editor
					editorState={textEditorState}
					onChange={this.onTextChange}
					placeholder="Comment text..."
					spellCheck
					plugins={[commentsMentionPlugin, keywordMentionPlugin, inlineToolbarPlugin]}
					ref={(element) => { this.editor = element; }}
				/>

				{/* mentions suggestions for keywords */}
				<keywordMentionPlugin.MentionSuggestions
					onSearchChange={this._onKeywordSearchChange}
					suggestions={this.state.keywordSuggestions}
				/>

				{/* mentions suggestions for comments cross reference */}
				<commentsMentionPlugin.MentionSuggestions
					onSearchChange={this._onCommentsSearchChange}
					suggestions={this.state.commentsSuggestions}
				/>
			</div>
		);
	}
}
