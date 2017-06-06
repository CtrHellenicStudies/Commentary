import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin from 'draft-js-mention-plugin';
import { Separator } from 'draft-js-inline-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	OrderedListButton,
	BlockquoteButton,
} from 'draft-js-buttons';

// api
import Commenters from '/imports/api/collections/commenters';
import Keywords from '/imports/api/collections/keywords';
import ReferenceWorks from '/imports/api/collections/referenceWorks';

// lib
import muiTheme from '/imports/lib/muiTheme';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';

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
const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

class AddTranslation extends React.Component {
	//noinspection JSAnnotator
	static propTypes: {
		//noinspection JSAnnotator
		selectedLineFrom: React.PropTypes.number,
		//noinspection JSAnnotator
		selectedLineTo: React.PropTypes.number,
		//noinspection JSAnnotator
		submitForm: React.PropTypes.func.isRequired,
		//noinspection JSAnnotator
		onTypeChange: React.PropTypes.func.isRequired,
		//noinspection JSAnnotator
		isTest: React.PropTypes.bool,
	},
	//noinspection JSAnnotator
	childContextTypes: {
		//noinspection JSAnnotator
		muiTheme: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),

			commenterValue: null,
			textValue: '',
			snackbarOpen: false,
			snackbarMessage: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	onTextChange(textEditorState) {
		let textHtml = '';
		textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
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

	shouldKeyDownEventCreateNewOption(sig) {
		if (sig.keyCode === 13 ||
			sig.keyCode === 188) {
			return true;
		}

		return false;
	},

	// TODO rework handleSubmit for translation
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

	// TODO rework validateStateForSubmit for AddTranslation
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
								<Editor
									editorState={this.state.titleEditorState}
									onChange={this.onTitleChange}
									placeholder="Translation . . ."
									spellCheck
									stripPastedStyles
									plugins={[singleLinePlugin]}
									blockRenderMap={singleLinePlugin.blockRenderMap}
								/>
							</h1>
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

const AddKeywordContainer = createContainer(() => {
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


