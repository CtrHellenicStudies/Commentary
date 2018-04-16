import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import { compose } from 'react-apollo';
import slugify from 'slugify';

import { Form } from 'formsy-react';
import Select from 'react-select';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import update from 'immutability-helper';
import autoBind from 'react-autobind';

// lib
import Utils from '../../../../lib/utils';

// components
import TagsInput from '../../../inputs/components/TagsInput/TagsInput';
import DraftEditorInput from '../../../draftEditor/components/DraftEditiorInput/DraftEditorInput';
import ReferenceWork from '../../../referenceWorks/components/ReferenceWork/ReferenceWork';


import './AddComment.css';


class AddComment extends Component {

	constructor(props) {
		super(props);

		this.state = {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),

			titleValue: '',
			textValue: '',

			commentersValue: [],
			referenceWorksValue: [],
			tagsValue: [],

			snackbarOpen: false,
			snackbarMessage: '',
			ready: false
		};

		autoBind(this);
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
			referenceWorks,
		});
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
		const textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
		});
	}

	onCommenterValueChange(commenter) {
		this.setState({
			commentersValue: commenter,
		});
	}

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

		this.props.addComment(
			this.state,
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

		if (!this.state.commentersValue) {
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

		if (tag) {
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

	render() {
		const { tagOptions, commenterOptions, referenceWorkOptions } = this.props;
		console.log(this.props.selectedLemmaCitation);

		return (
			<div className="comments lemma-panel-visible ">
				<div className={'comment-outer'}>
					<Form
						onValid={this._enableButton}
						onInvalid={this._disableButton}
						onValidSubmit={this.handleSubmit}
					>
						<article
							className="comment commentary-comment paper-shadow "
							style={{ marginLeft: 0 }}
						>
							<div className="comment-upper">
								{commenterOptions && commenterOptions.length ?
									<Select
										name="commenter"
										id="commenter"
										required={false}
										options={commenterOptions}
										value={this.state.commentersValue}
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
									tagsValue={this.state.tagsValue}
									addTagBlock={this.addTagBlock}
									removeTagBlock={this.removeTagBlock}
									moveTagBlock={this.moveTagBlock}
									onTagValueChange={this.onTagValueChange}
									onIsMentionedInLemmaChange={this.onIsMentionedInLemmaChange}
									selectTagType={this.selectTagType}
									addNewTag={this.addNewTag}
									keywords={tagOptions}
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
								/>

								<ReferenceWork
									update={this.updateReferenceWorks}
									referenceWorkOptions={referenceWorkOptions}
									referenceWorks={this.state.referenceWorksValue}
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
					</Form>

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
	commenters: PropTypes.array,
};

AddComment.defaultProps = {
	tags: [],
};

const mapStateToProps = (state, props) => ({
	commenters: state.auth.commenters,
});

export default compose(
	connect(mapStateToProps)
)(AddComment);
