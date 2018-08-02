import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import autoBind from 'react-autobind';
import Cookies from 'js-cookie';
import { Router } from 'react-router';
import $ from 'jquery';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select from 'react-select';
import Formsy from 'formsy-react';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import slugify from 'slugify';
import _ from 'underscore';

// lib
import Utils from '../../../../lib/utils';
import muiTheme from '../../../../lib/muiTheme';
import userInRole from '../../../../lib/userInRole';

// components
import LinkDecorator from '../../../inputs/components/LinkDecorator';
import TagsInput from '../../../inputs/components/TagsInput';
import ReferenceWork from '../../../referenceWorks/components/ReferenceWork';
import DraftEditorInput from '../../../inputs/components/DraftEditorInput';

import './AddRevision.css';



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

		this.updateReferenceWorks = this.updateReferenceWorks.bind(this);
		this.addNewReferenceWork = this.addNewReferenceWork.bind(this);

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

	componentWillReceiveProps(props) {
		const tags = props.keywordsQuery.loading ? [] : props.keywordsQuery.keywords;
		let commenters = [];
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		if (user && user.canEditCommenters) {
			commenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters.filter(x =>
				user.canEditCommenters.find(y => y === x._id));
		}
		const referenceWorks = props.referenceWorksQuery.loading ? [] : props.referenceWorksQuery.referenceWorks;
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
		this.setState({
			ready: !props.commentersQuery.loading && !props.referenceWorksQuery.loading && !props.keywordsQuery.loading,
			tags,
			referenceWorkOptions,
			commentersOptions,
		});
	}

	componentWillUnmount() {
		if (this.timeout) clearTimeout(this.timeout);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	updateReferenceWorks(referenceWorks) {
		this.setState({
			referenceWorks: referenceWorks
		});
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
			return EditorState.createWithContent(convertFromRaw(revision.textRaw), LinkDecorator);
		} else if (revision.text) {
			const blocksFromHTML = convertFromHTML(revision.text);
			return EditorState.createWithContent(
				ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				),
				LinkDecorator
			);
		}
		console.error('Missing field text or textRaw in revision');
	}

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = $(titleHtml).text();
		this.setState({
			titleEditorState,
			titleValue: title,
		});
	}

	onTextChange(textEditorState) {

		this.setState({
			textEditorState: textEditorState,
		});
	}

	_onKeywordSearchChange({ value }) {
		const keywordSuggestions = [];
		const keywords = this.state.tags;
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

	handleSubmit() {
		const { textEditorState } = this.state;

		// TODO: form validation
		// TODO: Migrate to formsy components

		// create html from textEditorState's content
		const textHtml = Utils.getHtmlFromContext(textEditorState.getCurrentContent(), undefined);

		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		this.props.submitForm(this.state, textHtml, textRaw);
	}

	handleUpdate() {
		const data = this.refs.form.getModel(); // eslint-disable-line
		const referenceWorks = this.state.referenceWorks;
		let key;

		for (key in data) { // eslint-disable-line
			const params = key.split('_');
			params[0] = parseInt(params[0], 10);
			referenceWorks[params[0]][params[1]] = data[key];
		}
		this.props.update(this.state);
	}

	removeComment() {
		this.props.commentRemove(this.props.comment._id).then(function() {
			this.props.history.push('/commentary');
		});
	}

	selectRevision(event) {
		const revisions = _.sortBy(this.props.comment.revisions, 'created');
		const revision = revisions[event.currentTarget.id];

		this.setState({
			revision,
			titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
			textEditorState: EditorState.createWithContent(stateFromHTML(revision.text), LinkDecorator),
		});
	}

	removeRevision() {
		const that = this;
		this.props.commentRemoveRevision(this.props.comment._id, this.state.revision).then(function() {
			this.props.history.push(`/commentary/${that.props.comment._id}/edit`);
		});
	}

	addNewReferenceWork(reference) {
		const { tenantId } = this.props;
		const _reference = {
			title: reference.value,
			slug: slugify(reference.value.toLowerCase()),
			tenantId,
		};

		this.props.referenceWorkCreate(_reference).then(error => {
			if (error) {
				this.showSnackBar(error);
			} else {
				this.showSnackBar({message: 'Reference work added'});
			}
		});
	}

	addTagBlock() {
		const newTagBlock = {
			tagId: Date.now(),
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

	onTagValueChange(tag, i) {
		const { tagsValue, tags } = this.state;

		let _selectedKeyword;
		if (tag)			{
			tags.forEach(_tag => {
				if (_tag._id === tag.value) {
					_selectedKeyword = _tag;
				}
			});
		}


		tagsValue[i].tagId = tag ? tag.value : undefined;
		tagsValue[i].keyword = _selectedKeyword;
		tagsValue[i].isSet = !!tag;

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

	selectTagType(tagId, event, index) {
		const currentTags = this.state.tagsValue;
		this.setState({
			tagsValue: event.target.value
		});
		const newKeyword = {};
		for (const [key, value] of Object.entries(currentTags[index].keyword)) {
			if (key === 'type') {
				newKeyword[key] = event.target.value;
			} else if (key !== '_id' && key !== '__typename') {
				newKeyword[key] = value;
			}
		}
		currentTags[index].keyword = newKeyword;
		this.setState({
			tagsValue: currentTags
		});
		this.props.keywordUpdate(tagId, newKeyword);
	}

	addNewTag(tag) {
		const { tenantId } = this.props;

		const keyword = [{
			title: tag.value,
			slug: slugify(tag.value.toLowerCase()),
			type: 'word',
			count: 1,
			tenantId,
		}];

		this.props.keywordInsert(keyword);
	}

	render() {
		const { comment } = this.props;
		const { revision, titleEditorState, textEditorState, tagsValue, commentersOptions } = this.state;
		const { tags } = this.state;
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
												Router.go('/commentary/', {}, {_id: comment._id});
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
								</div>

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
										name="draft_comment_title"
										editorState={titleEditorState}
										onChange={this.onTitleChange}
										placeholder="Comment title..."
										spellcheck
										disableMentions
										stripPastedStyles
										singleLine
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
									keywords={tags}
								/>

							</div>
							<div className="comment-lower clearfix" style={{ paddingTop: 20 }}>
								<DraftEditorInput
									name="draft_comment_text"
									editorState={textEditorState}
									onChange={this.onTextChange}
									placeholder="Comment text..."
									disableMentions
									spellcheck
									mediaOn
								/>
								<ReferenceWork
									referenceWorks={this.state.referenceWorks}
									update={this.updateReferenceWorks}
									referenceWorkOptions={this.state.referenceWorkOptions}
									ready={this.state.ready}
									addNew={this.addNewReferenceWork}
								/>

								<div className="comment-edit-action-button">
									<RaisedButton
										type="submit"
										label="Add revision"
										labelPosition="after"
										icon={<FontIcon className="mdi mdi-plus" />}
									/>
								</div>
								{(
									userInRole(Cookies.get('user'), ['editor', 'admin'])
                                   &&
                                    comment.revisions.length > 1
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
				</div>
			</div>
		);
	}
}


AddRevision.propTypes = {
	submitForm: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	history: PropTypes.array,
	referenceWorkCreate: PropTypes.func,
	keywordInsert: PropTypes.func,
	keywordUpdate: PropTypes.func,
	commentersQuery: PropTypes.object,
	keywordsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	commentRemove: PropTypes.func,
	commentRemoveRevision: PropTypes.func
};

AddRevision.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

export default AddRevision;
