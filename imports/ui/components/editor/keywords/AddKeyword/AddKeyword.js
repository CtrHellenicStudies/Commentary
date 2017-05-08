import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { fromJS } from 'immutable';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved, max-len
import Commenters from '/imports/api/collections/commenters';
import Keywords from '/imports/api/collections/keywords';
import ReferenceWorks from '/imports/api/collections/referenceWorks';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved, max-len
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	CodeButton,
	HeadlineOneButton,
	HeadlineTwoButton,
	HeadlineThreeButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
	CodeBlockButton,
} from 'draft-js-buttons'; // eslint-disable-line import/no-unresolved

import 'draft-js-mention-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved

const singleLinePlugin = createSingleLinePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
	structure: [
		BoldButton,
		ItalicButton,
		UnderlineButton,
		CodeButton,
		Separator,
		HeadlineOneButton,
		HeadlineTwoButton,
		HeadlineThreeButton,
		UnorderedListButton,
		OrderedListButton,
		BlockquoteButton,
		CodeBlockButton,
	]
});
const { InlineToolbar } = inlineToolbarPlugin;
const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

const AddKeyword = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number,
		selectedLineTo: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
		onTypeChange: React.PropTypes.func.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),

			commenterValue: null,
			titleValue: '',
			textValue: '',
			referenceWorksValue: null,
			keywordsValue: null,
			keyideasValue: null,

			snackbarOpen: false,
			snackbarMessage: '',

			suggestions: fromJS([]),
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},


	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	},

	onTextChange(textEditorState) {
		let textHtml = '';
		textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
		});
	},

	onTypeChange(e, type) {
		this.props.onTypeChange(type);
	},

	onKeywordsValueChange(keywords) {
		this.setState({
			keywordsValue: keywords,
		});
	},

	onKeyideasValueChange(keyidea) {
		this.setState({
			keyideasValue: keyidea,
		});
	},

	onNewOptionCreator(newOption) {
		return {
			label: newOption.label,
			value: newOption.label
		};
	},

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	},

	onSearchChange({ value }) {
		const keywordSuggestions = [];
		const keywords = this.data.keywordsOptions.concat(this.data.keyideasOptions);
		keywords.forEach((keyword) => {
			keywordSuggestions.push({
				name: keyword.label,
				link: `/keywords/${keyword.slug}`,
			});
		});

		this.setState({
			suggestions: defaultSuggestionsFilter(value, fromJS(keywordSuggestions)),
		});
	},

	getMeteorData() {
		Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });
		const keywordsOptions = [];
		const keywords = Keywords.find({ type: 'word' }).fetch();
		keywords.forEach((keyword) => {
			keywordsOptions.push({
				value: keyword.title,
				label: keyword.title,
				slug: keyword.slug,
			});
		});

		const keyideasOptions = [];
		const keyideas = Keywords.find({ type: 'idea' }).fetch();
		keyideas.forEach((keyidea) => {
			keyideasOptions.push({
				value: keyidea.title,
				label: keyidea.title,
				slug: keyidea.slug,
			});
		});

		Meteor.subscribe('referenceWorks');
		const referenceWorksOptions = [];
		const referenceWorks = ReferenceWorks.find().fetch();
		referenceWorks.forEach((referenceWork) => {
			referenceWorksOptions.push({
				value: referenceWork._id,
				label: referenceWork.title,
			});
		});

		Meteor.subscribe('commenters', Session.get('tenantId'));
		const commentersOptions = [];
		let commenters = [];
		if (Meteor.user() && Meteor.user().canEditCommenters) {
			commenters = Commenters.find({ _id: { $in: Meteor.user().canEditCommenters } }).fetch();
		}
		commenters.forEach((commenter) => {
			commentersOptions.push({
				value: commenter._id,
				label: commenter.name,
			});
		});

		return {
			keywordsOptions,
			keyideasOptions,
			referenceWorksOptions,
			commentersOptions,
		};
	},

	shouldKeyDownEventCreateNewOption(sig) {
		if (sig.keyCode === 13 ||
			sig.keyCode === 188) {
			return true;
		}

		return false;
	},

	isOptionUnique(newOption) {
		const keywordsOptions = this.data.keywordsOptions;
		const keyideasOptions = this.data.keyideasOptions;
		const keywordsValue = this.state.keywordsValue ? this.state.keywordsValue : [];
		const keyideasValue = this.state.keyideasValue ? this.state.keyideasValue : [];
		const BreakException = {};
		try {
			keywordsOptions.forEach((keywordsOption) => {
				if (keywordsOption.label === newOption.option.label) throw BreakException;
			});
			keyideasOptions.forEach((keyideasOption) => {
				if (keyideasOption.label === newOption.option.label) throw BreakException;
			});
			keywordsValue.forEach((keywordValue) => {
				if (keywordValue.label === newOption.option.label) throw BreakException;
			});
			keyideasValue.forEach((keyideaValue) => {
				if (keyideaValue.label === newOption.option.label) throw BreakException;
			});
		} catch (e) {
			if (e === BreakException) return false;
		}
		return true;
	},

	handleSubmit(event) {
		const { textEditorState } = this.state;

		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		const textHtml = convertToHTML({
			entityToHTML: (entity, originalText) => {
				if (entity.type === 'mention') {
					return <a className="keyword-gloss" data-link={Utils.getEntityData(entity, 'link')}>{originalText}</a>;
				}
			},
		})(textEditorState.getCurrentContent());

		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		if (!error.errors) {
			this.props.submitForm(this.state, textHtml, textRaw);
		}
	},

	showSnackBar(error) {
		console.log(error);
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	},

	validateStateForSubmit() {
		let errors = false;
		let errorMessage = 'Missing keyword data:';
		if (!this.state.titleValue) {
			errors = true;
			errorMessage += ' Keyword or Key Idea,';
		}

		if (errors === true) {
			errorMessage = errorMessage.slice(0, -1);
			errorMessage += '.';
		}

		return {
			errors,
			errorMessage,
		};
	},

	// --- END SUBMIT / VALIDATION HANDLE --- //
	render() {
		const styles = {
			block: {
				maxWidth: 250,
			},
			radioButton: {
				marginBottom: 16,
			},
		};


		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<div className="comment-upper">
							<h1 className="add-comment-title">
								<Editor
									editorState={this.state.titleEditorState}
									onChange={this.onTitleChange}
									placeholder="Key word or idea . . ."
									spellCheck
									stripPastedStyles
									plugins={[singleLinePlugin]}
									blockRenderMap={singleLinePlugin.blockRenderMap}
								/>
							</h1>
							<RadioButtonGroup
								className="keyword-type-toggle"
								name="type"
								defaultSelected="word"
								onChange={this.onTypeChange}
							>
								<RadioButton
									value="word"
									label="Word"
									style={styles.radioButton}
									className="keyword-type-radio"
								/>
								<RadioButton
									value="idea"
									label="Idea"
									style={styles.radioButton}
									className="keyword-type-radio"
								/>
							</RadioButtonGroup>
						</div>
						<div
							className="comment-lower"
							style={{ paddingTop: 20 }}
						>
							{/*<RichTextEditor
								className="keyword-editor"
								placeholder="Keyword description . . ."
								value={this.state.textEditorState}
								onChange={this.onTextChange}
								toolbarConfig={toolbarConfig}
							/>*/}
							<Editor
								editorState={this.state.textEditorState}
								onChange={this.onTextChange}
								placeholder="Keyword description . . ."
								spellCheck
								stripPastedStyles
								plugins={[mentionPlugin, inlineToolbarPlugin]}
								ref={(element) => { this.editor = element; }}
							/>
							<MentionSuggestions
								onSearchChange={this.onSearchChange}
								suggestions={this.state.suggestions}
							/>
							<div className="comment-edit-action-button">
								<RaisedButton
									type="submit"
									label="Add Keyword"
									labelPosition="after"
									onClick={this.handleSubmit}
									icon={<FontIcon className="mdi mdi-plus" />}
								/>
							</div>
						</div>

					</article>

					<Snackbar
						className="add-comment-snackbar"
						open={this.state.snackbarOpen}
						message={this.state.snackbarMessage}
						autoHideDuration={4000}
					/>
				</div>
				<div className="inline-toolbar-wrap">
					<InlineToolbar />
				</div>
			</div>
		);
	},
});

export default AddKeyword;