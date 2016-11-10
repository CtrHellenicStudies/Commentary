import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select from 'react-select';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import RichTextEditor from 'react-rte';

// https://github.com/JedWatson/react-select
// import 'react-select/dist/react-select.css';

const singleLinePlugin = createSingleLinePlugin();


AddComment = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number,
		selectedLineTo: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: RichTextEditor.createEmptyValue(),

			titleValue: '',
			textValue: '',
			referenceWorksValue: '',
			keywordsValue: null,
			keyideasValue: null,

			snackbarOpen: false,
			snackbarMessage: '',
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
		// var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
		this.setState({
			textEditorState,
			textValue: textEditorState.toString('html'),
		});
	},

	onKeywordsValueChange(keywords) {
		if (keywords) {
			const keywordArray = keywords.split(',');
			const errorKeywords = this.errorKeywords(keywordArray, 'word');
			if (errorKeywords.length) {
				errorKeywords.forEach((keyword) => {
					const index = keywordArray.indexOf(keyword);
					keywordArray.splice(index, 1);
				});
			}
			this.setState({
				keywordsValue: keywordArray,
			});
		} else {
			this.setState({
				keywordsValue: null,
			});
		}
	},

	onKeyideasValueChange(keyideas) {
		if (keyideas) {
			const keyideasArray = keyideas.split(',');
			const errorKeywords = this.errorKeywords(keyideasArray, 'idea');
			if (errorKeywords.length) {
				errorKeywords.forEach((keyword) => {
					const index = keyideasArray.indexOf(keyword);
					keyideasArray.splice(index, 1);
				});
			}
			this.setState({
				keyideasValue: keyideasArray,
			});
		} else {
			this.setState({
				keyideasValue: null,
			});
		}
	},

	onReferenceWorksValueChange(referenceWork) {
		this.setState({
			referenceWorksValue: referenceWork,
		});
	},

	onReferenceValueChange(event) {
		this.setState({
			referenceValue: event.target.value,
		});
	},

	onReferenceLinkValueChange(event) {
		this.setState({
			referenceLinkValue: event.target.value,
		});
	},

	getMeteorData() {
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

		const referenceWorksOptions = [];
		const referenceWorks = ReferenceWorks.find().fetch();
		referenceWorks.forEach((referenceWork) => {
			referenceWorksOptions.push({
				value: referenceWork.slug,
				label: referenceWork.title,
			});
		});

		return {
			keywordsOptions,
			keyideasOptions,
			referenceWorksOptions,
		};
	},

	handleSubmit(event) {
		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		if (!error.errors) {
			this.props.submitForm(this.state);
		}
	},

	errorKeywords(keywordsArray, type) {
		// 'type' is the type of keywords passed to this function
		const errorKeywords = [];
		let keyideasValue = [];
		switch (type) {
		case 'word':
			keyideasValue = this.state.keyideasValue;
			keywordsArray.forEach((keyword) => {
				this.data.keyideasOptions.forEach((keyideaOption) => {
					if (keyword === keyideaOption.value) {
						errorKeywords.push(keyword);
					}
				});

				if (Array.isArray(keyideasValue)) {
					keyideasValue.forEach((keyideaValue) => {
						if (keyword === keyideaValue) {
							errorKeywords.push(keyword);
						}
					});
				}
			});
			break;

		case 'idea':
			keywordsValue = this.state.keywordsValue;
			keywordsArray.forEach((keyword) => {
				this.data.keywordsOptions.forEach((keywordOption) => {
					if (keyword === keywordOption.value) {
						errorKeywords.push(keyword);
					}
				});

				if (Array.isArray(keywordsValue)) {
					keywordsValue.forEach((keywordValue) => {
						if (keyword === keywordValue) {
							errorKeywords.push(keyword);
						}
					});
				}
			});
			break;
		default:
			break;
		}
		return errorKeywords;
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
		if (this.state.titleValue === '') {
			errors = true;
			errorMessage += ' title,';
		}
		if (this.state.textValue === '<p><br></p>') {
			errors = true;
			errorMessage += ' comment text,';
		}
		if (this.props.selectedLineFrom === 0) {
			errors = true;
			errorMessage += ' no line selected,';
		}
		if (errors === true) {
			errorMessage.slice(0, -1);
			errorMessage += '.';
		}
		return {
			errors,
			errorMessage,
		};
	},

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

					<article className="comment commentary-comment paper-shadow " style={{ marginLeft: 0 }}>

						<div className="comment-upper">
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
							<Select
								name="keywords"
								id="keywords"
								required={false}
								options={this.data.keywordsOptions}
								multi
								allowCreate
								value={this.state.keywordsValue}
								onChange={this.onKeywordsValueChange}
								placeholder="Keywords..."
							/>
							<Select
								name="keyideas"
								id="keyideas"
								required={false}
								options={this.data.keyideasOptions}
								multi
								allowCreate
								value={this.state.keyideasValue}
								onChange={this.onKeyideasValueChange}
								placeholder="Keyideas..."
							/>

						</div>
						<div className="comment-lower" style={{ paddingTop: 20 }}>
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
