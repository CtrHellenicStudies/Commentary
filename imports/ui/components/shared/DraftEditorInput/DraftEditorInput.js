import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import stylePropType from 'react-style-proptype';
import reactCSS from 'reactcss';
import { EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { fromJS } from 'immutable';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
} from 'draft-js-buttons';

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
class DraftEditorInput extends Component {

	static propTypes = {
		// props recieved from formsy HOC:
		onChange: PropTypes.func.isRequired,
		spellcheck: PropTypes.bool,
		placeholder: PropTypes.string.isRequired,
		keywordsMention: PropTypes.bool,
		tags: PropTypes.array,
		singleLine: PropTypes.bool,
		stripPastedStyles: PropTypes.bool,
		editorState: PropTypes.object.isRequired,
		InlineToolbar : PropTypes.func //Remember that if you want use InlineToolbar, you also need plugin for it
	};
	constructor(props){
		super(props);
		this.onEditorChange = this.onEditorChange.bind(this);
		this.onMentionSearchChange = this.onMentionSearchChange.bind(this);
		this.onKeywordSearchChange = this.onKeywordSearchChange.bind(this);
		this.mentionPlugin = createMentionPlugin();
		this.keywordsPlugin = createMentionPlugin({mentionPrefix: '#', mentionTrigger: '#'});
		this.state = {
			mentions: fromJS([]),
			keywords: fromJS([])
		};
	}
	onEditorChange(editorState) {
		this.props.onChange(editorState);
	}
	
	onMentionSearchChange({ value }) {
		// use Meteor call method, as comments are not available on clint app
		Meteor.call('comments.getSuggestions', value, (err, res) => {
			// handle error:
			if (err) throw new Meteor.Error(err);

			// handle response:
			const _mentions = _getSuggestionsFromComments(res);

			this.setState({
				mentions: defaultSuggestionsFilter(value,fromJS(_mentions))
			});
		});
	}
	onKeywordSearchChange({ value }) {
		const _keywords = [];
		this.props.tags.forEach((keyword) => {
			_keywords.push({
				name: keyword.title,
				link: `/tags/${keyword.slug}`,
			});
		});

		this.setState({
			keywords: defaultSuggestionsFilter(value, fromJS(_keywords)),
		});
	}
	getPlugins(){
		let ret = [this.mentionPlugin, this.keywordsPlugin];
		if(this.props.plugins)
			ret = ret.concat(this.props.plugins);
		ret = !this.props.InlineToolbar ? [inlineToolbarPlugin].concat(ret) : ret; //Is there any custom InlineToolbar
		ret = this.props.singleLine === true ? ret.concat([singleLinePlugin]) : ret;
		return ret;
	}
	getPlainAttributes(){
		let ret = {
			spellCheck : this.props.spellcheck == true ?  true : false,
			stripPastedStyles : this.props.stripPastedStyles === true ? true : false
		}
		return ret;
	}
	render() {
		let plugins = this.getPlugins();
		const InlineToolbar = this.props.singleLine ? undefined : (this.props.InlineToolbar || inlineToolbarPlugin.InlineToolbar);
		const plainAttributes = this.getPlainAttributes();
		const { MentionSuggestions } = this.mentionPlugin;
		const KeywordsSuggestions = this.keywordsPlugin.MentionSuggestions;
		return (
			<div className="draft-editor-input">
				{this.props.label !== undefined ? (<div >{this.props.label}</div>) : ''}
				<div>
					<Editor
						editorState={this.props.editorState}
						onChange={this.onEditorChange}
						plugins = {plugins}
						{...plainAttributes}
						placeholder={this.props.placeholder}
						blockRenderMap={this.props.blockRenderMap}
						{...this.props.ref !== undefined ? (ref = this.props.ref) : ''}
					/>
					{this.props.tags !== undefined ? (
						<div>
							<MentionSuggestions
							onSearchChange={this.onMentionSearchChange}
							suggestions={this.state.mentions}
								/>
							<KeywordsSuggestions
							onSearchChange={this.onKeywordSearchChange}
							suggestions={this.state.keywords}
							/>
						</div>) : ''
					}
				</div>
				{ InlineToolbar !== undefined ?
					(<div className="inline-toolbar-wrap">
						<InlineToolbar />
					</div>) : ''
				}
			</div>
		);
	}
}

export default formsyHOC(DraftEditorInput);
