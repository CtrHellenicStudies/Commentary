import { Session } from 'meteor/session';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// https://github.com/JedWatson/react-select
import Select from 'react-select';
import { Creatable } from 'react-select';
import RichTextEditor from 'react-rte';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';

const singleLinePlugin = createSingleLinePlugin();

AddComment = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number,
		selectedLineTo: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: RichTextEditor.createEmptyValue(),

			commenterValue: null,
			titleValue: '',
			textValue: '',
			referenceWorksValue: null,
			keywordsValue: null,
			keyideasValue: null,

			snackbarOpen: false,
			snackbarMessage: '',
		};
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('keywords.all', Session.get("tenantId"));
		const keywordsOptions = [];
		const keywords = Keywords.find({ type: 'word' }).fetch();
		keywords.forEach((keyword) => {
			keywordsOptions.push({
				value: keyword.title,
				label: keyword.title,
			});
		});

		const keyideasOptions = [];
		const keyideas = Keywords.find({ type: 'idea' }).fetch();
		keyideas.forEach((keyidea) => {
			keyideasOptions.push({
				value: keyidea.title,
				label: keyidea.title,
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
		if (Meteor.user() && Meteor.user().commenterId) {
			commenters = Commenters.find({ _id: { $in: Meteor.user().commenterId } }).fetch();
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
		// var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
		this.setState({
			textEditorState,
			textValue: textEditorState.toString('html'),
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

	shouldKeyDownEventCreateNewOption(sig) {
		if (sig.keyCode === 13 ||
			sig.keyCode === 188) {
			return true;
		} else {
			return false;
		}
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
		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		if (!error.errors) {
			this.props.submitForm(this.state);
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
		const toolbarConfig = {
			display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
			INLINE_STYLE_BUTTONS: [{
				label: 'Italic',
				style: 'ITALIC',
			}, {
				label: 'Underline',
				style: 'UNDERLINE',
			}],
			BLOCK_TYPE_BUTTONS: [{
				label: 'UL',
				style: 'unordered-list-item',
			}],
		};


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
							<RichTextEditor
								placeholder="Comment text..."
								value={this.state.textEditorState}
								onChange={this.onTextChange}
								toolbarConfig={toolbarConfig}
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
			</div>
		);
	},
});
