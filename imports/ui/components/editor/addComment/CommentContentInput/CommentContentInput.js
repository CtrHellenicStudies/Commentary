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

// Keyword Mentions
const keywordMentionPlugin = createMentionPlugin();

// Comments Cross Reference Mentions
const commentsMentionPlugin = createMentionPlugin({
	mentionTrigger: '#',
});

function _getSuggestionsFromComments(comments) {
	const suggestions = [];

	// if there are comments:
	if (comments.length) {

		// loop through all comments
		// add suggestion for each comment
		comments.forEach((comment) => {

			// get the most recent revision
			const revision = comment.revisions[comment.revisions.length - 1];

			const suggestion = {
				// create suggestio name:
				name: `"${revision.title}" -`,

				// set link for suggestion
				link: `/commentary?_id=${comment._id}`,

				// set id for suggestion
				id: comment._id,
			};

			// loop through commenters and add them to suggestion name
			comment.commenters.forEach((commenter, i) => {
				if (i === 0) suggestion.name += ` ${commenter.name}`;
				else suggestion.name += `, ${commenter.name}`;
			});

			suggestions.push(suggestion);
		});
	}
	return suggestions;
}




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

		this._onKeywordSearchChange = this._onKeywordSearchChange.bind(this);
		this._onCommentsSearchChange = this._onCommentsSearchChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(contentEditorState) {
		const textHtml = stateToHTML(this.state.contentEditorState.getCurrentContent());

		this.setState({
			contentEditorState,
			textValue: textHtml,
		});
	}

	_onKeywordSearchChange({ value }) {
		const keywordSuggestions = [];
		const keywords = this.props.tags;
		keywords.forEach((keyword) => {
			keywordSuggestions.push({
				name: keyword.title,
				link: `/tags/${keyword.slug}`,
			});
		});

		this.setState({
			keywordSuggestions: defaultSuggestionsFilter(value, fromJS(keywordSuggestions)),
		});
	}

	_onCommentsSearchChange({ value }) {
		// use Meteor call method, as comments are not available on clint app
		Meteor.call('comments.getSuggestions', value, (err, res) => {
			// handle error:
			if (err) throw new Meteor.Error(err);

			// handle response:
			const commentsSuggestions = _getSuggestionsFromComments(res);

			this.setState({
				commentsSuggestions: fromJS(commentsSuggestions),
			});
		});
	}


	render() {
		return (
			<div className="commentContentInput">
				<DraftInputEditor
					editorState={this.state.contentEditorState}
					onChange={this.onTextChange}
					placeholder="Comment text..."
					spellcheck={true}
					plugins={[keywordMentionPlugin, commentsMentionPlugin]}
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
