import { Session } from 'meteor/session';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select from 'react-select';
import { Creatable } from 'react-select';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import RichTextEditor from 'react-rte';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import 'draft-js-mention-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import { fromJS } from 'immutable';

const singleLinePlugin = createSingleLinePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

AddRevision = React.createClass({

	propTypes: {
		submitForm: React.PropTypes.func.isRequired,
		comment: React.PropTypes.object.isRequired,
	},

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

		const blocksFromHTML = convertFromHTML(revision.text);
		const revisionEditorState = EditorState.createWithContent(
				ContentState.createFromBlockArray(
				  blocksFromHTML.contentBlocks,
				  blocksFromHTML.entityMap
				)
			);

		return {
			revision,

			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
			textEditorState: revisionEditorState,

			titleValue: '',
			textValue: '',

			keywordsValue,
			keyideasValue,
			suggestions: fromJS([]),
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

		return {
			keywordsOptions,
			keyideasOptions,
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

	handleSubmit(event) {
		// TODO: form validation
		event.preventDefault();
		this.props.submitForm(this.state);
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
		Meteor.call('comment.remove.revision', this.props.comment._id, this.state.revision);
	},

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
								placeholder="Key Ideas..."
							/>
							{/* TODO: this.props.comment.keyideas*/}

						</div>
						<div className="comment-lower" style={{ paddingTop: 20 }}>
							<Editor
								editorState={this.state.textEditorState}
								onChange={this.onTextChange}
								placeholder="Comment text..."
								spellCheck
								stripPastedStyles
								plugins={[mentionPlugin, inlineToolbarPlugin]}
								ref={(element) => { this.editor = element; }}
							/>
							<MentionSuggestions
								onSearchChange={this.onSearchChange}
								suggestions={this.state.suggestions}
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
