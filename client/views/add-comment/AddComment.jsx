import { Session } from 'meteor/session';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// https://github.com/JedWatson/react-select
import Select from 'react-select';
import { Creatable } from 'react-select';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { fromJS } from 'immutable';
import { convertToHTML } from 'draft-convert';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import 'draft-js-mention-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved

const singleLinePlugin = createSingleLinePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

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

AddComment = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getDefaultProps() {
		return {
			selectedLineFrom: null,
		};
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
			keywordSuggestions: fromJS([]),
			commentsSuggestions: fromJS([]),
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
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

		Meteor.subscribe('commenters');
		const commentersOptions = [];
		let commenters = [];
		if (Meteor.user() && Meteor.user().canEditCommenters) {
			commenters = Commenters.find({ _id: { $in: Meteor.user().canEditCommenters} }).fetch();
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

	// --- BEGIN FORM HANDLE --- //

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	},

	onTextChange(textEditorState) {
		const textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
		});
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

	_onKeywordSearchChange({ value }) {
		const keywordSuggestions = [];
		const keywords = this.data.keywordsOptions.concat(this.data.keyideasOptions);
		keywords.forEach((keyword) => {
			keywordSuggestions.push({
				name: keyword.label,
				link: `/keywords/${keyword.slug}`,
			});
		});

		this.setState({
			keywordSuggestions: defaultSuggestionsFilter(value, fromJS(keywordSuggestions)),
		});
	},

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

	onReferenceWorksValueChange(referenceWork) {
		this.setState({
			referenceWorksValue: referenceWork,
		});
	},

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	},

	// --- END FORM HANDLE --- //

	// --- BEGIN SUBMIT / VALIDATION HANDLE --- //

	handleSubmit(event) {
		const { textEditorState } = this.state;

		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		if (!error.errors) {

			// create html from textEditorState's content
			const textHtml = convertToHTML({

				// performe necessary html transformations:
				entityToHTML: (entity, originalText) => {

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
		let errorMessage = 'Missing comment data:';
		if (!this.state.titleValue) {
			errors = true;
			errorMessage += ' title,';
		}
		if (this.state.textValue === '<p><br></p>' || !this.state.textValue) {
			errors = true;
			errorMessage += ' comment text,';
		}
		if (!this.props.selectedLineFrom) {
			errors = true;
			errorMessage += ' no line selected,';
		}
		if (!this.state.commenterValue) {
			errors = true;
			errorMessage += ' no commenter selected,';
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

		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<div className="comment-upper">
							{ this.data.commentersOptions.length > 1 ?
								<Select
									name="commenter"
									id="commenter"
									required={false}
									options={this.data.commentersOptions}
									value={this.state.commenterValue}
									onChange={this.onCommenterValueChange}
									placeholder="Commenter..."
								/>
								:
								''
							}
							<h1 className="add-comment-title">
								<Editor
									editorState={this.state.titleEditorState}
									onChange={this.onTitleChange}
									placeholder="Comment title..."
									spellCheck
									stripPastedStyles
									plugins={[singleLinePlugin]}
									blockRenderMap={singleLinePlugin.blockRenderMap}
								/>
							</h1>
							<Creatable
								name="keywords"
								id="keywords"
								required={false}
								options={this.data.keywordsOptions}
								multi
								value={this.state.keywordsValue}
								onChange={this.onKeywordsValueChange}
								newOptionCreator={this.onNewOptionCreator}
								shouldKeyDownEventCreateNewOption={this.shouldKeyDownEventCreateNewOption}
								isOptionUnique={this.isOptionUnique}
								placeholder="Keywords..."
							/>
							<Creatable
								name="keyideas"
								id="keyideas"
								required={false}
								options={this.data.keyideasOptions}
								multi
								value={this.state.keyideasValue}
								onChange={this.onKeyideasValueChange}
								newOptionCreator={this.onNewOptionCreator}
								shouldKeyDownEventCreateNewOption={this.shouldKeyDownEventCreateNewOption}
								isOptionUnique={this.isOptionUnique}
								placeholder="Key ideas..."
							/>

						</div>
						<div
							className="comment-lower"
							style={{ paddingTop: 20 }}
						>
							<Editor
								editorState={this.state.textEditorState}
								onChange={this.onTextChange}
								placeholder="Comment text..."
								spellCheck
								stripPastedStyles
								plugins={[keywordMentionPlugin, commentsMentionPlugin, inlineToolbarPlugin]}
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

							<div className="comment-reference">
								<Select
									name="referenceWorks"
									id="referenceWorks"
									required={false}
									options={this.data.referenceWorksOptions}
									value={this.state.referenceWorksValue}
									onChange={this.onReferenceWorksValueChange}
									placeholder="Reference..."
								/>
							</div>

							<div className="add-comment-button">
								<RaisedButton
									type="submit"
									label="Add comment"
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
