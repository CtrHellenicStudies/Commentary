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
import { Modifier, EditorState, Entity } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import getSearchText from '/utils/getSearchText';
import getTypeByTrigger from '/utils/getTypeByTrigger';
import { WYSIWYGEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js-mention-plugin/lib/plugin.css';


const singleLinePlugin = createSingleLinePlugin();

AddKeyword = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number,
		selectedLineTo: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
		onTypeChange: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			titleEditorState: EditorState.createEmpty(),
			textValue: RichTextEditor.createEmptyValue(),
			commenterValue: null,
			titleValue: '',
			referenceWorksValue: null,
			keywordsValue: null,
			keyideasValue: null,
			showkeywordsuggestions: true,
			keywordSuggestions: [],
			keywordSuggestionStyles: {
				left: 0,
				top: 0,
			},

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
		Meteor.subscribe('keywords.all', {tenantId: Session.get("tenantId")});
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

		Meteor.subscribe('commenters', Session.get("tenantId"));
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

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	},

	onTextChange(value) {
		// var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
		let html = value.toString('html');
		let words = [];
		let lastWord;
		let hasKeywordSuggestion = false;

		if (html.lastIndexOf('#') >= 0) {
			words = html.replace(/<(?:.|\n)*?>/gm, '').split(' ');
			lastWord = words[words.length - 1];

			// html = Utils.replaceLast(html, lastWord, `<span className="keyword-candidate">${lastWord}</span>`);
			const entityKey = Entity.create("TOKEN", "IMMUTABLE", {foo:'bar'});
			const editorState = value.getEditorState();
			const currentSelectionState = editorState.getSelection();
			const { begin, end } = getSearchText(editorState, currentSelectionState);
			const mentionTextSelection = currentSelectionState.merge({
				anchorOffset: begin,
				focusOffset: end,
			});

			debugger;
			let mentionReplacedContent = Modifier.replaceText(
				editorState.getCurrentContent(),
				mentionTextSelection,
				`#foo`,
				null, // no inline style needed
				entityKey
			);

			const blockKey = mentionTextSelection.getAnchorKey();
			const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength();
			if (blockSize === end) {
				mentionReplacedContent = Modifier.insertText(
					mentionReplacedContent,
					mentionReplacedContent.getSelectionAfter(),
					' ',
				);
			}
			const newEditorState = EditorState.push(
				editorState,
				mentionReplacedContent,
				'insert-mention',
			);
			EditorState.forceSelection(newEditorState, mentionReplacedContent.getSelectionAfter());
			debugger;


			if (lastWord.length > 1 && lastWord.slice(0, 1) === '#') {
				this.showKeywordLookahead(lastWord.replace('#', ''), 0, 0);
			}
		} else {
			this.setState({
				textValue: value,
			});
		}
		console.log(this.state.textValue.toString('html'));
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

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	},

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
		if (errors === true) {
			errorMessage = errorMessage.slice(0, -1);
			errorMessage += '.';
		}
		return {
			errors,
			errorMessage,
		};
	},

	showKeywordLookahead(word) {
		let keywordSuggestions = this.data.keywordsOptions.concat(this.data.keyideasOptions);
		keywordSuggestions = keywordSuggestions.filter((item) => (
      item.label.toLowerCase().search(
        word.toLowerCase()) !== -1
    ));

		this.setState({
			showKeywordSuggestions: true,
			keywordSuggestions,
		});
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
							<RichTextEditor
								className="keyword-editor"
								placeholder="Keyword description . . ."
								value={this.state.textValue}
								onChange={this.onTextChange}
								toolbarConfig={toolbarConfig}
							/>
							<WYSIWYGEditor
								editorState={this.state.textValue}
								onChange={this.onTextChange}
								placeholder="Key word or idea . . ."
								spellCheck
								stripPastedStyles
								plugins={[mentionPlugin]}
							/>
							<div
								className="keywords-suggestions"
								style={this.state.keywordSuggestionStyles}
							>
								{this.state.keywordSuggestions.map((suggestion, i) =>
									<span
										key={i}
										className="keywords-suggestion"
										data-value={suggestion.value}
									>
										{suggestion.label}
									</span>
								)}
							</div>
							<div className="add-comment-button">
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
			</div>
		);
	},
});
