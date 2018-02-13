import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import { compose } from 'react-apollo';
import Cookies from 'js-cookie';
import slugify from 'slugify';

import Formsy from 'formsy-react';
import Select from 'react-select';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import update from 'immutability-helper';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorkCreateMutation from '../../../referenceWorks/graphql/mutations/referenceWorkCreate';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';
import keywordsQuery from '../../../keywords/graphql/queries/keywordsQuery';
import keywordInsertMutation from '../../../keywords/graphql/mutations/keywordsInsert';
import keywordUpdateMutation from '../../../keywords/graphql/mutations/keywordsUpdate';

// lib:
import Utils from '../../../../lib/utils';

// components
import TagsInput from '../../../inputs/components/TagsInput/TagsInput';
import DraftEditorInput from '../../../draftEditor/components/DraftEditiorInput/DraftEditorInput';
import ReferenceWork from '../../../referenceWorks/components/ReferenceWork/ReferenceWork';


/*
 *	BEGIN AddComment
 */
class AddComment extends Component {

	constructor(props) {
		super(props);

		this.state = {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),

			commenterValue: null,
			titleValue: '',
			textValue: '',
			referenceWorks: [],

			tagsValue: [],

			snackbarOpen: false,
			snackbarMessage: '',
			ready: false
		};

		// methods:
		this._enableButton = this._enableButton.bind(this);
		this._disableButton = this._disableButton.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
		this.onCommenterValueChange = this.onCommenterValueChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
		this.addTagBlock = this.addTagBlock.bind(this);
		this.removeTagBlock = this.removeTagBlock.bind(this);
		this.moveTagBlock = this.moveTagBlock.bind(this);
		this.onTagValueChange = this.onTagValueChange.bind(this);
		this.onIsMentionedInLemmaChange = this.onIsMentionedInLemmaChange.bind(this);
		this.selectTagType = this.selectTagType.bind(this);
		this.addNewTag = this.addNewTag.bind(this);
		this.addNewReferenceWork = this.addNewReferenceWork.bind(this);
		this.updateReferenceWorks = this.updateReferenceWorks.bind(this);
		this.getCommentersForUser = this.getCommentersForUser.bind(this);
		this.filterCommentersForUser = this.filterCommentersForUser.bind(this);

		const properties = {
			tenantId: sessionStorage.getItem('tenantId')
		};
		this.props.commentersQuery.refetch(properties);
		this.props.referenceWorksQuery.refetch(properties);
		this.props.keywordsQuery.refetch(properties);
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
	updateReferenceWorks(referenceWorks) {
		this.setState({
			referenceWorks: referenceWorks
		});
	}
	// --- BEGIN FORM HANDLE --- //

	onTitleChange(titleEditorState) {
		const titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
		const title = $(titleHtml).text();
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
	onCommenterValueChange(commenter) {
		this.setState({
			commenterValue: commenter,
		});
	}

	// --- END FORM HANDLE --- //

	// --- BEGIN SUBMIT / VALIDATION HANDLE --- //

	handleSubmit() {
		const { textEditorState } = this.state;

		// TODO: form validation
		// TODO: Migrate to formsy components
		const error = this.validateStateForSubmit();
		if (error) {
			this.showSnackBar(error);
			return false;
		}

		// create html from textEditorState's content
		const textHtml = Utils.getHtmlFromContext(textEditorState.getCurrentContent());
		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		this.props.submitForm(
			this.state,
			this.filterCommentersForUser(this.props.commentersQuery.commenters),
			textHtml,
			textRaw
		);
	}
	showSnackBar(error) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: error.message,
		});
		this.timeout = setTimeout(() => {
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
		if (!this.state.commenterValue) {
			errors = true;
			errorMessage += ' no commenter selected,';
		}
		if (errors === true) {
			errorMessage = errorMessage.slice(0, -1);
			errorMessage = new Error('data-missing', 'Missing comment data:'.concat(errorMessage, '.'));
		}
		return errorMessage;
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
		const { tags } = this.state;
		const { tagsValue } = this.state;
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

		const keyword = {
			title: tag.value,
			slug: slugify(tag.value.toLowerCase()),
			type: 'word',
			count: 1,
			tenantId: sessionStorage.getItem('tenantId'),
		};
		this.props.keywordInsert(keyword);
	}
	addNewReferenceWork(reference) {
		const _reference = {
			title: reference.value,
			slug: slugify(reference.value.toLowerCase()),
			tenantId: sessionStorage.getItem('tenantId')
		};
		this.props.referenceWorkCreate(_reference).then(err => {
			if (err) {
				this.showSnackBar(err);
			}			else {
				this.showSnackBar({message: 'Reference work added'});
			}
		});
	}
	getCommentersForUser(_commenters) {
		const commentersOptions = [];
		const { commenters } = this.props;
		console.log(commenters);
		_commenters.forEach((commenter) => {
			if (!commentersOptions.some(val => (
				commenter._id === val.value
			))) {
				if (commenters.find(x => x === commenter._id) !== undefined) {
					commentersOptions.push({
						value: commenter._id,
						label: commenter.name,
					});
				}
			}
		});
		return commentersOptions;
	}
	filterCommentersForUser(_commenters) {
		const commentersOptions = [];
		const { commenters } = this.props;
		_commenters.forEach((commenter) => {
			if (!commentersOptions.some(val => (
				commenter._id === val._id
			))) {
				if (commenters.find(x => x === commenter._id) !== undefined) {
					commentersOptions.push(commenter);
				}
			}
		});
		return commentersOptions;
	}
	// --- END SUBMIT / VALIDATION HANDLE --- //
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	}
	componentWillReceiveProps(newProps) {
		const ready = !newProps.keywordsQuery.loading && !newProps.referenceWorksQuery.loading && !newProps.commentersQuery.loading;
		if (!ready && this.state.ready) {
			this.setState({
				ready: false
			});
			return;
		}
		const { commenters } = this.props;
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		let _commenters = [];
		const tags = newProps.keywordsQuery.keywords;
		if (commenters) {
			_commenters = newProps.commentersQuery.commenters.filter(x =>
				commenters.find(y => y === x._id));
		}
		const commentersOptions = this.getCommentersForUser(_commenters);
		const referenceWorks = newProps.referenceWorksQuery.referenceWorks ? newProps.referenceWorksQuery.referenceWorks : [];
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
		this.setState({
			ready: true,
			referenceWorkOptions: referenceWorkOptions,
			commentersOptions: commentersOptions,
			tags: tags
		});
	}
	render() {
		const { tagsValue, commentersOptions } = this.state;

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
									<DraftEditorInput
										name="comment_title"
										editorState={this.state.titleEditorState}
										onChange={this.onTitleChange}
										placeholder="Comment title..."
										disableMentions
										spellcheck
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
									keywords={this.state.tags}
								/>

							</div>
							<div
								className="comment-lower clearfix"
								style={{ paddingTop: 20 }}
							>
								<DraftEditorInput
									name="comment_text"
									editorState={this.state.textEditorState}
									onChange={this.onTextChange}
									placeholder="Comment text..."
									spellcheck
									mediaOn
								/>

								<ReferenceWork
									update={this.updateReferenceWorks}
									referenceWorkOptions={this.state.referenceWorkOptions}
									referenceWorks={this.state.referenceWorks}
									ready={this.state.ready}
									addNew={this.addNewReferenceWork}
								/>

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
			</div>
		);

	}
}
AddComment.propTypes = {
	selectedLineFrom: PropTypes.number,
	commentersQuery: PropTypes.object,
	submitForm: PropTypes.func.isRequired,
	commenters: PropTypes.array,
	referenceWorkCreate: PropTypes.func,
	keywordInsert: PropTypes.func,
	keywordUpdate: PropTypes.func,
	keywordsQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object
};
AddComment.defaultProps = {
	selectedLineFrom: null,
	tags: [],
};

const mapStateToProps = (state, props) => ({
	commenters: state.auth.commenters,
});

export default compose(
	commentersQuery,
	referenceWorkCreateMutation,
	referenceWorksQuery,
	keywordsQuery,
	keywordInsertMutation,
	keywordUpdateMutation,
	connect(mapStateToProps)
)(AddComment);
