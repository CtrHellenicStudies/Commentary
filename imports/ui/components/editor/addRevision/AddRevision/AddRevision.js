import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import Cookies from 'js-cookie';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select, { Createable } from 'react-select';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import DraftEditorInput from '../../../shared/DraftEditorInput/DraftEditorInput';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import Snackbar from 'material-ui/Snackbar';
import slugify from 'slugify';
import _ from 'underscore';

// models
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';
import Commenters from '/imports/models/commenters';

// lib:
import muiTheme from '/imports/lib/muiTheme';

// helpers:
import linkDecorator from '/imports/ui/components/editor/addComment/LinkButton/linkDecorator';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import TagsInput from '/imports/ui/components/editor/addComment/TagsInput';
import CommentersEditorDialog from '../CommentersEditorDialog';

// Create toolbar plugin for editor
const singleLinePlugin = createSingleLinePlugin();

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

class AddRevision extends React.Component {

	constructor(props) {
		super(props);

		const { comment } = this.props;
		const revisionId = comment.revisions.length - 1;
		const revision = comment.revisions[revisionId]; // get newest revision
		let revisionTitle = '';

		const tagsValue = [];
		if (comment.keywords) {
			comment.keywords.forEach((keyword) => {
				tagsValue.push({
					isSet: true,
					keyword,
					tagId: keyword._id,
					isMentionedInLemma: keyword.isMentionedInLemma,
				});
			});
		}

		if (revision && revision.title) {
			revisionTitle = revision.title;
		}

		this.state = {
			revision,

			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revisionTitle)),
			textEditorState: this._getRevisionEditorState(revision),

			titleValue: '',
			textValue: '',

			tagsValue,

			referenceWorks: comment.referenceWorks || [],
			keywordSuggestions: fromJS([]),
			commentsSuggestions: fromJS([]),
			commentersEditorDialogOpen: false,
			commenterValue: comment.commenters ? comment.commenters.map((commenter) => ({value: commenter._id, label: commenter.name})) : [],
			snackbarOpen: false,

		};

		autoBind(this);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
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

	_getRevisionEditorState(revision) {
		if (revision.textRaw) {
			return EditorState.createWithContent(convertFromRaw(revision.textRaw), linkDecorator);
		} else if (revision.text) {
			const blocksFromHTML = convertFromHTML(revision.text);
			return EditorState.createWithContent(
				ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				),
				linkDecorator
			);
		}
		console.error('missing filed text or textRaw in revision');
	}

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = jQuery(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	}

	onTextChange(textEditorState) {
		const newTextEditorState = EditorState.set(textEditorState, {decorator: linkDecorator});

		this.setState({
			textEditorState: newTextEditorState,
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
				name: keyword.label,
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

	handleSubmit() {
		const { textEditorState } = this.state;

		// TODO: form validation
		// TODO: Migrate to formsy components

		// create html from textEditorState's content
		const textHtml = convertToHTML({

			// performe necessary html transformations:
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

		this.props.submitForm(this.state, textHtml, textRaw);
	}

	handleUpdate() {
		const data = this.refs.form.getModel(); // eslint-disable-line
		let key;

		for (key in data) { // eslint-disable-line
			const params = key.split('_');
			params[0] = parseInt(params[0], 10);
			this.state.referenceWorks[params[0]][params[1]] = data[key];
		}
		this.props.update(this.state);
	}

	removeComment() {
		const authToken = Cookies.get('loginToken');

		Meteor.call('comment.delete', authToken, this.props.comment._id, (err) => {
			if (err) {
				console.error(err);
				return false;
			}

			FlowRouter.go('/commentary');
		});
	}

	selectRevision(event) {
		const revisions = _.sortBy(this.props.comment.revisions, 'created');
		const revision = revisions[event.currentTarget.id];

		this.setState({
			revision,
			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
			textEditorState: EditorState.createWithContent(stateFromHTML(revision.text), linkDecorator),
		});
	}

	removeRevision() {
		const self = this;
		const authToken = Cookies.get('loginToken');
		Meteor.call('comment.remove.revision', authToken, this.props.comment._id, this.state.revision, (err) => {
			if (err) {
				throw new Meteor.Error('Error removing revision');
			}

			FlowRouter.go(`/commentary/${self.props.comment._id}/edit`);
		});
	}

	addReferenceWorkBlock() {
		const newReferenceWork = { referenceWorkId: '0' };
		this.setState({
			referenceWorks: [...this.state.referenceWorks, newReferenceWork],
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
			if (_tag._id === tag.value) {
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

	openCommentersEditorDialog() {
		this.setState({
			commentersEditorDialogOpen: true
		});
	}

	handleCloseCommentersEditorDialog() {
		this.setState({
			commentersEditorDialogOpen: false
		});
	}

	setCommenters(commenters) {
		this.setState({
			commenters: commenters
		});
	}

	onCommenterValueChange(commenter) {
		this.setState({
			commenterValue: commenter,
		});
	}

	showSnackBar(error) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: error.message,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
				snackbarMessage: ''
			});
		}, 4000);
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

	render() {
		const { comment, commentersOptions } = this.props;
		const { revision, titleEditorState, referenceWorks, textEditorState, tagsValue } = this.state;
		const { referenceWorkOptions, tags } = this.props;
		const revisions = _.sortBy(comment.revisions, 'created');

		return (
			<div className="comments lemma-panel-visible">
				<div className="comment-outer">

					<Formsy.Form
						ref="form" // eslint-disable-line
						onValid={this._enableButton}
						onInvalid={this._disableButton}
						onValidSubmit={this.handleSubmit}
					>
						<article className="comment commentary-comment paper-shadow " style={{ marginLeft: 0 }}>

							<div className="comment-upper">
								<div className="comment-action-buttons">
									<div className="comment-upper-action-button view-in-commentary">
										<FlatButton
											className="go-to-commentary-link"
											onClick={() => {
												FlowRouter.go('/commentary/', {}, {_id: comment._id});
											}}
											style={{
												border: '1px solid #ddd',
												maxHeight: 'none',
												fontSize: '12px',
												height: 'auto',
											}}
											label="View in Commentary"
										/>
									</div>
									<div className="comment-upper-action-button">
										<FlatButton
											label="Remove Comment"
											labelPosition="after"
											onClick={this.removeComment}
											style={{
												border: '1px solid #ddd',
												maxHeight: 'none',
												fontSize: '12px',
												height: 'auto',
											}}
										/>
									</div>
									{/* <div className="comment-upper-action-button">*/}
									{/* <FlatButton*/}
									{/* label="Edit Authors"*/}
									{/* labelPosition="after"*/}
									{/* onClick={this.openCommentersEditorDialog}*/}
									{/* style={{*/}
									{/* border: '1px solid #ddd',*/}
									{/* maxHeight: 'none',*/}
									{/* fontSize: '12px',*/}
									{/* height: 'auto',*/}
									{/* }}*/}
									{/* />*/}
									{/* </div>*/}
								</div>

								{/* <CommentersEditorDialog*/}
								{/* open={this.state.commentersEditorDialogOpen}*/}
								{/* handleClose={this.handleCloseCommentersEditorDialog}*/}
								{/* commenters={this.state.commenters}*/}
								{/* setCommenters={this.setCommenters}*/}
								{/* />*/}

								<br />
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
								: ''}
								<h1 className="add-comment-title">
									<DraftEditorInput
										editorState={titleEditorState}
										onChange={this.onTitleChange}
										placeholder="Comment title..."
										spellcheck = {true}
										stripPastedStyles = {true}
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
							<div className="comment-lower clearfix" style={{ paddingTop: 20 }}>
								<DraftEditorInput
									editorState={textEditorState}
									onChange={this.onTextChange}
									placeholder="Comment text..."
									spellcheck = {true}
									plugins={[commentsMentionPlugin, keywordMentionPlugin]}
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
															<Creatable
																name="referenceWorks"
																id="referenceWorks"
																required={false}
																options={_referenceWorkOptions}
																value={this.state.referenceWorks[i].referenceWorkId}
																// onChange={this.onReferenceWorksValueChange.bind(this, referenceWork, i)}
																onChange={this.onReferenceWorksValueChange}
																placeholder="Reference Work . . ."
															/>
															<FormGroup>
																<ControlLabel>Section Number: </ControlLabel>
																<FormsyText
																	name={`${i}_section`}
																	defaultValue={referenceWork.section}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Chapter Number: </ControlLabel>
																<FormsyText
																	name={`${i}_chapter`}
																	defaultValue={referenceWork.chapter}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Translation Number: </ControlLabel>
																<FormsyText
																	name={`${i}_translation`}
																	defaultValue={referenceWork.translation}
																/>
															</FormGroup>
															<FormGroup>
																<ControlLabel>Note Number: </ControlLabel>
																<FormsyText
																	name={`${i}_note`}
																	defaultValue={referenceWork.note}
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
										label="Add revision"
										labelPosition="after"
										icon={<FontIcon className="mdi mdi-plus" />}
									/>
								</div>
								{(
									Roles.userIsInRole(Meteor.user(), ['editor', 'admin'])
									&& comment.revisions.length > 1
								) ?
									<div className="comment-edit-action-button comment-edit-action-button--remove">
										<RaisedButton
											label="Remove revision"
											labelPosition="after"
											onClick={this.removeRevision}
											icon={<FontIcon className="mdi mdi-minus" />}
										/>
									</div>
								: '' }
								<div className="comment-edit-action-button">
									<RaisedButton
										label="Update without adding Revision"
										labelPosition="after"
										icon={<FontIcon className="mdi mdi-plus" />}
										onClick={this.handleUpdate}
									/>
								</div>
							</div>


							<div className="comment-revisions">
								{revisions.map((_revision, i) => (
									<FlatButton
										key={i}
										id={i}
										className={`revision ${revision._id === _revision._id ? 'selected-revision' : ''}`}
										onClick={this.selectRevision}
										label={`Revision ${moment(_revision.created).format('D MMMM YYYY')}`}
									/>
								))}
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
			</div>
		);
	}
}


AddRevision.propTypes = {
	submitForm: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	tags: PropTypes.array,
	referenceWorkOptions: PropTypes.array,
	commentersOptions: PropTypes.array,
};

AddRevision.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

const AddRevisionContainer = createContainer(({ comment }) => {

	Meteor.subscribe('keywords.all', {tenantId: Session.get('tenantId')});

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
}, AddRevision);

export default AddRevisionContainer;
