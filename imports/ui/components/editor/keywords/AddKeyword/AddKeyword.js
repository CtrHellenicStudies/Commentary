import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { EditorState, convertToRaw } from 'draft-js';
import DraftEditorInput from '../../../shared/DraftEditorInput/DraftEditorInput';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { fromJS } from 'immutable';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';


// models
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// lib
import muiTheme from '/imports/lib/muiTheme';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';

// Create toolbar plugin for editor
const singleLinePlugin = createSingleLinePlugin();

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

const AddKeyword = React.createClass({

	propTypes: {
		selectedLineFrom: PropTypes.number,
		selectedLineTo: PropTypes.number,
		submitForm: PropTypes.func.isRequired,
		onTypeChange: PropTypes.func.isRequired,
		keywordsOptions: PropTypes.array,
		keyideasOptions: PropTypes.array,
		isTest: PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

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
		return { muiTheme: getMuiTheme(muiTheme) };
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
		const keywords = this.props.keywordsOptions.concat(this.props.keyideasOptions);
		keywords.forEach((keyword) => {
			keywordSuggestions.push({
				name: keyword.label,
				link: `/tags/${keyword.slug}`,
			});
		});

		this.setState({
			suggestions: defaultSuggestionsFilter(value, fromJS(keywordSuggestions)),
		});
	},

	shouldKeyDownEventCreateNewOption(sig) {
		if (sig.keyCode === 13 ||
			sig.keyCode === 188) {
			return true;
		}

		return false;
	},

	isOptionUnique(newOption) {
		const keywordsOptions = this.props.keywordsOptions;
		const keyideasOptions = this.props.keyideasOptions;
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
				// handle LINK
				if (entity.type === 'LINK') {
					return <a href={entity.data.link} target="_blank" rel="noopener noreferrer">{originalText}</a>;
				}

				// handle keyword mentions
				if (entity.type === 'mention') {
					return <a className="keyword-gloss" data-link={Utils.getEntityData(entity, 'link')}>{originalText}</a>;
				}

				// handle hashtag / commets cross reference mentions
				if (entity.type === '#mention') {
					return <a className="comment-cross-ref" href={Utils.getEntityData(entity, 'link')}><div dangerouslySetInnerHTML={{ __html: originalText }} /></a>;
				}
			},
		})(textEditorState.getCurrentContent());

		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		if (!error.errors) {
			this.props.submitForm(this.state, textHtml, textRaw);
		}
	},

	showSnackBar(error) {
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
		const { isTest } = this.props;
		const styles = {
			block: {
				maxWidth: 250,
			},
			radioButton: {
				marginBottom: 16,
			},
		};


		if (isTest) {
			return null;
		}

		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<div className="comment-upper">
							<h1 className="add-comment-title">
								<DraftEditorInput
									name="draft_editor_tag_title"
									editorState={this.state.titleEditorState}
									onChange={this.onTitleChange}
									placeholder="Tag . . ."
									spellcheck={true}
									stripPastedStyles={true}
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
							className="comment-lower clearfix"
							style={{ paddingTop: 20 }}
						>
							<DraftEditorInput
								name="draft_editor_tag_desc"
								editorState={this.state.textEditorState}
								onChange={this.onTextChange}
								placeholder="Tag description . . ."
								spellcheck={true}
								stripPastedStyles={true}
								plugins={[mentionPlugin]}
								ref={(element) => { this.editor = element; }}
							/>
							<MentionSuggestions
								onSearchChange={this.onSearchChange}
								suggestions={this.state.suggestions}
							/>
							<div className="comment-edit-action-button">
								<RaisedButton
									type="submit"
									label="Add Tag"
									labelPosition="after"
									onClick={this.handleSubmit}
									icon={<FontIcon className="mdi mdi-plus" />}
								/>
							</div>
						</div>

					</article>

					<Snackbar
						className="editor-snackbar"
						open={this.state.snackbarOpen}
						message={this.state.snackbarMessage}
						autoHideDuration={4000}
					/>
				</div>
			</div>
		);
	},
});

const AddKeywordContainer = createContainer(() => {
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

}, AddKeyword);

export default AddKeywordContainer;
