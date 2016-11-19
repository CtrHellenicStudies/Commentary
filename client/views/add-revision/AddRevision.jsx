import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select from 'react-select';
import { EditorState, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import RichTextEditor from 'react-rte';

const singleLinePlugin = createSingleLinePlugin();

AddRevision = React.createClass({

	propTypes: {
		submitForm: React.PropTypes.func.isRequired,
		comment: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		const revisionId = this.props.comment.revisions.length - 1;
		const revision = this.props.comment.revisions[revisionId]; // get newest revision

		const keywordsValue = [];
		const keyideasValue = [];
		if (this.props.comment.keywords) {
			this.props.comment.keywords.forEach((keyword) => {
				switch (keyword.type) {
				case 'word':
					keywordsValue.push(keyword.title);
					break;
				case 'idea':
					keyideasValue.push(keyword.title);
					break;
				default:
					break;
				}
			});
		}

		return {
			revision,

			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
			textEditorState: RichTextEditor.createValueFromString(revision.text, 'html'),

			titleValue: '',
			textValue: '',

			keywordsValue,
			keyideasValue,
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

		return {
			keywordsOptions,
			keyideasOptions,
		};
	},

	handleSubmit(event) {
		// TODO: form validation
		event.preventDefault();

		// var error = this.validateStateForSubmit();

		// this.setState({
		//     snackbarOpen: error.errors,
		//     snackbarMessage: error.errorMessage,
		// });
		// if (!error.errors) {
		this.props.submitForm(this.state);
		// };
	},

	selectRevision(event) {
		const revision = this.props.comment.revisions[event.currentTarget.id];
		this.setState({
			revision,
			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
			textEditorState: EditorState.createWithContent(stateFromHTML(revision.text)),
		});
	},

	removeRevision() { // TODO: delete
		console.log('this.state.revision', this.state.revision);
		Meteor.call('comment.remove.revision', this.props.comment._id, this.state.revision);
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

	// validateStateForSubmit() {
	//     var errors = false;
	//     var errorMessage = "Missing comment data:"
	//     if(this.state.titleValue === ""){
	//         errors = true;
	//         errorMessage += " title,";
	//     };
	//     if(this.state.textValue === "<p><br></p>"){
	//         errors = true;
	//         errorMessage += " comment text,";
	//     };
	//     if(this.props.selectedLineFrom === 0){
	//         errors = true;
	//         errorMessage += " no line selected,";
	//     };
	//     if(errors === true) {
	//         errorMessage.slice(0,-1);
	//         errorMessage += ".";
	//     };
	//     return {
	//         errors: errors,
	//         errorMessage: errorMessage,
	//     };
	// },

	render() {
		const that = this;

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
							{/* TODO: this.props.comment.keyideas*/}

						</div>
						<div className="comment-lower" style={{ paddingTop: 20 }}>
							<RichTextEditor
								placeholder="Comment text..."
								value={this.state.textEditorState}
								onChange={this.onTextChange}
								toolbarConfig={toolbarConfig}
							/>

							<div className="comment-reference">
								<h4>Secondary Source(s):</h4>
								<p>
									{this.props.comment.referenceLink ?
										<a
											href={this.props.comment.referenceLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											{this.props.comment.reference}
										</a>
										:
										<span>
											{this.props.comment.reference}
										</span>
									}
								</p>
							</div>

							<div className="add-comment-button">
								<RaisedButton
									type="submit"
									label="Add revision"
									labelPosition="after"
									onClick={this.handleSubmit}
									icon={<FontIcon className="mdi mdi-plus" />}
								/>
							</div>
							{Roles.userIsInRole(Meteor.user(), ['developer']) ? /* TODO: delete*/
								<div className="add-comment-button">
									<RaisedButton
										type="submit"
										label="(developer only) Remove revision"
										labelPosition="after"
										onClick={this.removeRevision}
										icon={<FontIcon className="mdi mdi-minus" />}
									/>
								</div>
								:
								''
							}

						</div>

						<div className="comment-revisions">
							{this.props.comment.revisions.map((revision, i) => (
								<FlatButton
									key={i}
									id={i}
									className="revision selected-revision"
									onClick={that.selectRevision}
									label={`Revision ${moment(revision.created).format('D MMMM YYYY')}`}
								/>
							))}
						</div>

					</article>

				</div>
			</div>

		);
	},
});
