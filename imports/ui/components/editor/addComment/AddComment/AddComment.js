import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import Cookies from 'js-cookie';
import slugify from 'slugify';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
// https://github.com/JedWatson/react-select
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import Select from 'react-select';
import { EditorState, convertToRaw, Modifier, CompositeDecorator } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
} from 'draft-js-buttons';

// api
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import TagsInput from '/imports/ui/components/editor/addComment/TagsInput';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

// helpers:
import linkDecorator from '/imports/ui/components//editor/addComment/LinkButton/linkDecorator';

/*
 *	helpers
 */

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


// Keyword Mentions
const keywordMentionPlugin = createMentionPlugin();

// Comments Cross Reference Mentions
const commentsMentionPlugin = createMentionPlugin({
	mentionTrigger: '#',
});

const ListGroupItemDnD = createListGroupItemDnD('referenceWorkBlocks');

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


/*
 *	BEGIN AddComment
 */
class AddComment extends React.Component {
	static propTypes = {
		selectedLineFrom: React.PropTypes.number,
		submitForm: React.PropTypes.func.isRequired,
		commentersOptions: React.PropTypes.array,
		tags: React.PropTypes.array,
		referenceWorkOptions: React.PropTypes.array,
	};

	static defaultProps = {
		selectedLineFrom: null,
		commentersOptions: [],
		tags: [],
		referenceWorkOptions: [],
	};

	constructor(props) {
		super(props);

		this.state = {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(linkDecorator),

			commenterValue: null,
			titleValue: '',
			textValue: '',
			referenceWorks: [],

			tagsValue: [],

			snackbarOpen: false,
			snackbarMessage: '',
			keywordSuggestions: fromJS([]),
			commentsSuggestions: fromJS([]),
		};

		// methods:
		this._enableButton = this._enableButton.bind(this);
		this._disableButton = this._disableButton.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
		this.onReferenceWorksValueChange = this.onReferenceWorksValueChange.bind(this);
		this._onKeywordSearchChange = this._onKeywordSearchChange.bind(this);
		this._onCommentsSearchChange = this._onCommentsSearchChange.bind(this);
		this.onCommenterValueChange = this.onCommenterValueChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
		this.addReferenceWorkBlock = this.addReferenceWorkBlock.bind(this);
		this.removeReferenceWorkBlock = this.removeReferenceWorkBlock.bind(this);
		this.moveReferenceWorkBlock = this.moveReferenceWorkBlock.bind(this);
		this.addTagBlock = this.addTagBlock.bind(this);
		this.removeTagBlock = this.removeTagBlock.bind(this);
		this.moveTagBlock = this.moveTagBlock.bind(this);
		this.onTagValueChange = this.onTagValueChange.bind(this);
		this.onIsMentionedInLemmaChange = this.onIsMentionedInLemmaChange.bind(this);
		this.selectTagType = this.selectTagType.bind(this);
		this.addNewTag = this.addNewTag.bind(this);
	}

	_enableButton() {
		this.setState({
			canSubmit: true,
		});
	}

	_disableButton() {
		this.setState({
			canSubmit: false,
		});
	}

	// --- BEGIN FORM HANDLE --- //

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	}

	onTextChange(textEditorState) {
		const textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
		});
	}

	onReferenceWorksValueChange(referenceWork) {
		const referenceWorks = this.state.referenceWorks;
		referenceWorks[referenceWork.i].referenceWorkId = referenceWork.value;

		this.setState({
			referenceWorks,
		});

	}

	_onKeywordSearchChange({ value }) {
		const keywordSuggestions = [];
		const keywords = this.props.tags;
		keywords.forEach((keyword) => {
			keywordSuggestions.push({
				name: keyword.title,
				link: `/tags/${keyword.slug}`,
			});
		});

		this.setState({
			keywordSuggestions: defaultSuggestionsFilter(value, fromJS(keywordSuggestions)),
		});
	}

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
	}

	onCommenterValueChange(commenter) {
		this.setState({
			commenterValue: commenter,
		});
	}

	// --- END FORM HANDLE --- //

	// --- BEGIN SUBMIT / VALIDATION HANDLE --- //

	handleSubmit(data) {
		const { textEditorState } = this.state;

		// TODO: form validation
		// TODO: Migrate to formsy components
		const error = this.validateStateForSubmit();
		if (error) {
			this.showSnackBar(error);
			return false;
		}

		// create html from textEditorState's content
		const textHtml = convertToHTML({

			// performe necessary html transformations:
			entityToHTML: (entity, originalText) => {

				// handle LINK
				if (entity.type === 'LINK') {
					return <a href={entity.data.link}>{originalText}</a>;
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

		let key;
		for (key in data) { // eslint-disable-line
			const params = key.split('_');
			params[0] = parseInt(params[0], 10);
			this.state.referenceWorks[params[0]][params[1]] = data[key];
		}

		this.props.submitForm(this.state, textHtml, textRaw);
	}

	showSnackBar(error) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: error.message,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}

	validateStateForSubmit() {
		let errors = false;
		let errorMessage = '';
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
			errorMessage = new Meteor.Error('data-missing', 'Missing comment data:'.concat(errorMessage, '.'));
		}
		return errorMessage;
	}

	addReferenceWorkBlock() {
		this.state.referenceWorks.push({ referenceWorkId: Random.id() });
		this.setState({
			referenceWorks: this.state.referenceWorks,
		});
	}

	removeReferenceWorkBlock(i) {
		this.setState({
			referenceWorks: update(this.state.referenceWorks, { $splice: [[i, 1]] }),
		});
	}

	moveReferenceWorkBlock(dragIndex, hoverIndex) {
		const { referenceWorks } = this.state;
		const dragIntroBlock = referenceWorks[dragIndex];

		this.setState(update(this.state, {
			referenceWorks: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragIntroBlock],
				],
			},
		}));
	}

	addTagBlock() {
		const newTagBlock = {
			tagId: Random.id(),
			isNotMentionedInLemma: false,
			isSet: false,
		};

		this.setState({
			tagsValue: [...this.state.tagsValue, newTagBlock],
		});
	}

	removeTagBlock(i) {
		this.setState({
			tagsValue: update(this.state.tagsValue, { $splice: [[i, 1]] }),
		});
	}

	moveTagBlock(dragIndex, hoverIndex) {
		const { tagsValue } = this.state;
		const dragIntroBlock = tagsValue[dragIndex];

		this.setState(update(this.state, {
			tagsValue: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragIntroBlock],
				],
			},
		}));
	}

	onTagValueChange(tag) {
		const { tags } = this.props;
		const { tagsValue } = this.state;

		let _selectedKeyword;

		tags.forEach(_tag => {
			if (_tag._id == tag.value) {
				_selectedKeyword = _tag;
			}
		});


		tagsValue[tag.i].tagId = tag.value;
		tagsValue[tag.i].keyword = _selectedKeyword;
		tagsValue[tag.i].isSet = true;

		this.setState({
			tagsValue: [...tagsValue],
		});
	}

	onIsMentionedInLemmaChange(tag, i) {
		const tagsValue = this.state.tagsValue;

		tagsValue[i].isNotMentionedInLemma = !tag.isNotMentionedInLemma;

		this.setState({
			tagsValue,
		});
	}

	selectTagType(tagId, event, index) {
		const currentTags = this.state.tagsValue;
		currentTags[index].keyword.type = event.target.value;
		this.setState({
			tagsValue: currentTags
		});

		Meteor.call('keywords.changeType', Cookies.get('loginToken'), tagId, event.target.value, (err) => {
			if (err) {
				this.showSnackBar(err);
			}			else {
				this.showSnackBar({message: 'Keyword type changed'});
			}
		});
	}
	
	addNewTag(tag) {

		const keyword = [{
			title: tag.value,
			slug: slugify(tag.value.toLowerCase()),
			type: 'word',
			count: 1,
			tenantId: Session.get('tenantId'),
		}];

		Meteor.call('keywords.insert', Cookies.get('loginToken'), keyword, (err) => {
			if (err) {
				this.showSnackBar(err);
			}			else {
				this.showSnackBar({message: 'Tag added'});
			}
		});
	}
	// --- END SUBMIT / VALIDATION HANDLE --- //

	render() {
		const { revision, titleEditorState, keyideasValue, referenceWorks, textEditorState, tagsValue } = this.state;
		const { commentersOptions, tags, referenceWorkOptions } = this.props;

		return (
			<div className="comments lemma-panel-visible ">
				<div className={'comment-outer'}>
					<Formsy.Form
						onValid={this._enableButton}
						onInvalid={this._disableButton}
						onValidSubmit={this.handleSubmit}
					>
						<article
							className="comment commentary-comment paper-shadow "
							style={{ marginLeft: 0 }}
						>
							<div className="comment-upper">
								{commentersOptions && commentersOptions.length ?
									<Select
										name="commenter"
										id="commenter"
										required={false}
										options={commentersOptions}
										value={this.state.commenterValue}
										onChange={this.onCommenterValueChange}
										placeholder="Commentator..."
										multi
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

								<TagsInput
									tagsValue={tagsValue}
									addTagBlock={this.addTagBlock}
									removeTagBlock={this.removeTagBlock}
									moveTagBlock={this.moveTagBlock}
									onTagValueChange={this.onTagValueChange}
									onIsMentionedInLemmaChange={this.onIsMentionedInLemmaChange}
									selectTagType={this.selectTagType}
									addNewTag={this.addNewTag}
								/>

							</div>
							<div
								className="comment-lower clearfix"
								style={{ paddingTop: 20 }}
							>
								<Editor
									editorState={this.state.textEditorState}
									onChange={this.onTextChange}
									placeholder="Comment text..."
									spellCheck
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
									<h4>Secondary Source(s):</h4>
									<FormGroup
										controlId="referenceWorks"
										className="form-group--referenceWorks"
									>
										<ListGroupDnD>
											{/*
												DnD: add the ListGroupItemDnD component
												IMPORTANT:
												"key" prop must not be taken from the map function - has to be unique like _id
												value passed to the "key" prop must not be then edited in a FormControl component
													- will cause errors
												"index" - pass the map functions index variable here
											*/}
											{referenceWorks.map((referenceWork, i) => {
												const _referenceWorkOptions = [];
												referenceWorkOptions.forEach((rW) => {
													_referenceWorkOptions.push({
														value: rW.value,
														label: rW.label,
														slug: rW.slug,
														type: rW.type,
														i,
													});
												});

												return (
													<ListGroupItemDnD
														key={referenceWork.referenceWorkId}
														index={i}
														className="form-subitem form-subitem--referenceWork"
														moveListGroupItem={this.moveReferenceWorkBlock}
													>
														<div
															className="reference-work-item"
														>
															<div
																className="remove-reference-work-item"
																onClick={this.removeReferenceWorkBlock.bind(this, i)}
															>
																<IconButton
																	iconClassName="mdi mdi-close"
																	style={{
																		padding: '0',
																		width: '32px',
																		height: '32px',
																		borderRadius: '100%',
																		border: '1px solid #eee',
																		color: '#666',
																		margin: '0 auto',
																		background: '#f6f6f6',
																	}}
																/>
															</div>
															<Select
																name="referenceWorks"
																id="referenceWorks"
																required={false}
																options={_referenceWorkOptions}
																value={this.state.referenceWorks[i].referenceWorkId}
																onChange={this.onReferenceWorksValueChange}
																placeholder="Reference Work . . ."
															/>
															<FormGroup>
																<ControlLabel>Section Number: </ControlLabel>
																<FormsyText
																	name={`${i}_section`}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Chapter Number: </ControlLabel>
																<FormsyText
																	name={`${i}_chapter`}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Translation Number: </ControlLabel>
																<FormsyText
																	name={`${i}_translation`}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Note Number: </ControlLabel>
																<FormsyText
																	name={`${i}_note`}
																/>
															</FormGroup>
														</div>
													</ListGroupItemDnD>
												);
											})}
										</ListGroupDnD>
										<RaisedButton
											label="Add Reference Work"
											onClick={this.addReferenceWorkBlock}
										/>
									</FormGroup>
								</div>

								<div className="comment-edit-action-button">
									<RaisedButton
										type="submit"
										label="Add comment"
										labelPosition="after"
										icon={<FontIcon className="mdi mdi-plus" />}
									/>
								</div>
							</div>

						</article>
					</Formsy.Form>

					<Snackbar
						className="editor-snackbar"
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
	}
}

const AddCommentContainer = createContainer(() => {
	Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });

	const tags = Keywords.find().fetch();

	Meteor.subscribe('referenceWorks', Session.get('tenantId'));
	const referenceWorks = ReferenceWorks.find().fetch();
	const referenceWorkOptions = [];
	referenceWorks.forEach((referenceWork) => {
		if (!referenceWorkOptions.some(val => (
			referenceWork.slug === val.slug
		))) {
			referenceWorkOptions.push({
				value: referenceWork._id,
				label: referenceWork.title,
				slug: referenceWork.slug,
			});
		}
	});

	Meteor.subscribe('commenters', Session.get('tenantId'));
	const commentersOptions = [];
	let commenters = [];
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		commenters = Commenters.find({ _id: { $in: Meteor.user().canEditCommenters} }).fetch();
	}
	commenters.forEach((commenter) => {
		if (!commentersOptions.some(val => (
			commenter._id === val.value
		))) {
			commentersOptions.push({
				value: commenter._id,
				label: commenter.name,
			});
		}
	});

	return {
		tags,
		referenceWorkOptions,
		commentersOptions,
	};

}, AddComment);

export default AddCommentContainer;
