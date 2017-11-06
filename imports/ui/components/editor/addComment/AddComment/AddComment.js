import React from 'react';
import PropTypes from 'prop-types';
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
import DraftEditorInput from '../../../shared/DraftEditorInput/DraftEditorInput';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { stateToHTML } from 'draft-js-export-html';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert';

// models
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import LinkButton from '/imports/ui/components/editor/addComment/LinkButton';
import TagsInput from '/imports/ui/components/editor/addComment/TagsInput';
import ReferenceWork from './referenceWork/ReferenceWork';

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


const ListGroupItemDnD = createListGroupItemDnD('referenceWorkBlocks');

/*
 *	BEGIN AddComment
 */
class AddComment extends React.Component {
	static propTypes = {
		selectedLineFrom: PropTypes.number,
		submitForm: PropTypes.func.isRequired,
		commentersOptions: PropTypes.array,
		tags: PropTypes.array,
		referenceWorkOptions: PropTypes.array,
	};

	static defaultProps = {
		selectedLineFrom: null,
		commentersOptions: [],
		tags: [],
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
		this.updateReferenceWorks = this.updateReferenceWorks.bind(this);
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
	updateReferenceWorks(referenceWorks){
		this.setState({
			referenceWorks:referenceWorks
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

		this.props.submitForm(this.state, textHtml, textRaw);
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
	componentWillUnmount(){
		if(this.timeout)
			clearTimeout(this.timeout);
	}
	render() {
		const { revision, titleEditorState, keyideasValue, textEditorState, tagsValue } = this.state;
		const { commentersOptions, tags } = this.props;
		if (!this.props.ready) {
		    return null;
		}
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
										disableMentions={true}
										spellcheck={true}
										stripPastedStyles = {true}
										singleLine = {true}
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
								<DraftEditorInput
									name="comment_text"
									editorState={this.state.textEditorState}
									onChange={this.onTextChange}
									placeholder="Comment text..."
									spellcheck={true}
									tags={this.props.tags}
									mediaOn={true}
								/>

								<ReferenceWork update={this.updateReferenceWorks} referenceWorkOptions={this.props.referenceWorkOptions} ready={this.props.ready} />

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

const AddCommentContainer = createContainer(() => {
	const handleKeywords = Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });

	const tags = Keywords.find().fetch();
	const handleWorks = Meteor.subscribe('referenceWorks', Session.get('tenantId'));
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

	const handleCommenters = Meteor.subscribe('commenters', Session.get('tenantId'));
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
		ready: handleKeywords.ready() && handleWorks.ready() && handleCommenters.ready(),
		tags,
		referenceWorkOptions,
		commentersOptions,
	};

}, AddComment);

export default AddCommentContainer;
