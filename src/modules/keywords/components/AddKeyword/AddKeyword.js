import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import $ from 'jquery';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Formsy from 'formsy-react';
import Snackbar from 'material-ui/Snackbar';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import keywordsQuery from '../../graphql/queries/keywordsQuery';

// lib
import Utils from '../../../../lib/utils';
import DraftEditorInput from '../../../draftEditor/components/DraftEditiorInput/DraftEditorInput';

class AddKeyword extends Component {

	constructor(props) {
		super(props);
		this.state = {
			titleEditorState: EditorState.createEmpty(),
			textEditorState: EditorState.createEmpty(),

			commenterValue: null,
			titleValue: '',
			textValue: '',
			keywordsValue: null,
			keyideasValue: null,

			snackbarOpen: false,
			snackbarMessage: ''
		};

		// TODO: move refetch to container
		this.props.keywordsQuery.refetch({
			tenantId: props.tenantId
		});

		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
		this.onTypeChange = this.onTypeChange.bind(this);
		this.onKeywordsValueChange = this.onKeywordsValueChange.bind(this);
		this.onKeyideasValueChange = this.onKeyideasValueChange.bind(this);
		this.onNewOptionCreator = this.onNewOptionCreator.bind(this);
		this.onCommenterValueChange = this.onCommenterValueChange.bind(this);
		this.shouldKeyDownEventCreateNewOption = this.shouldKeyDownEventCreateNewOption.bind(this);
		this.isOptionUnique = this.isOptionUnique.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
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
		let textHtml = '';
		textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());

		this.setState({
			textEditorState,
			textValue: textHtml,
		});
	}

	onTypeChange(e, type) {
		this.props.onTypeChange(type);
	}

	onKeywordsValueChange(keywords) {
		this.setState({
			keywordsValue: keywords,
		});
	}

	onKeyideasValueChange(keyidea) {
		this.setState({
			keyideasValue: keyidea,
		});
	}

	onNewOptionCreator(newOption) {
		return {
			label: newOption.label,
			value: newOption.label
		};
	}

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	}
	shouldKeyDownEventCreateNewOption(sig) {
		if (sig.keyCode === 13 ||
			sig.keyCode === 188) {
			return true;
		}

		return false;
	}

	isOptionUnique(newOption) {
		const keywordsOptions = this.state.keywordsOptions;
		const keyideasOptions = this.state.keyideasOptions;
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
	}

	handleSubmit(event) {
		const { textEditorState } = this.state;

		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);
		const textHtml = Utils.getHtmlFromContext(textEditorState.getCurrentContent());

		const textRaw = convertToRaw(textEditorState.getCurrentContent());

		if (!error.errors) {
			this.props.submitForm(this.state, textHtml, textRaw);
		}
	}

	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		this.timeout = setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	}
	validateStateForSubmit() {
		let errors = false;
		let errorMessage = 'Missing keyword data:';
		if (!this.state.titleValue) {
			errors = true;
			errorMessage += ' Keyword or Key Idea,';
		}

		if (errors === true) {
			errorMessage = errorMessage.slice(0, -1);
			errorMessage += '.';
		}

		return {
			errors,
			errorMessage,
		};
	}
	componentWillReceiveProps(newProps) {

		const keywordsOptions = [];
		const keywords = newProps.keywordsQuery.loading ? [] : newProps.keywordsQuery.keywords
			.filter(x => x.type === 'word');
		keywords.forEach((keyword) => {
			keywordsOptions.push({
				value: keyword.title,
				label: keyword.title,
				slug: keyword.slug,
			});
		});

		const keyideasOptions = [];
		const keyideas = newProps.keywordsQuery.loading ? [] : newProps.keywordsQuery.keywords
			.filter(x => x.type === 'idea');
		keyideas.forEach((keyidea) => {
			keyideasOptions.push({
				value: keyidea.title,
				label: keyidea.title,
				slug: keyidea.slug,
			});
		});

		const commentersOptions = [];
		const tenantCommenters = newProps.commentersQuery.loading ? [] : newProps.commentersQuery.commenters;
		let commenters = [];
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		if (user && user.canEditCommenters) {
			commenters = tenantCommenters.filter((x =>
				user.canEditCommenters.find(y => y === x._id) !== undefined));
		}
		commenters.forEach((commenter) => {
			commentersOptions.push({
				value: commenter._id,
				label: commenter.name,
			});
		});
		this.setState({
			commentersOptions: commentersOptions,
			keywordsOptions: keywordsOptions,
			keyideasOptions: keyideasOptions,
		});
	}
	// --- END SUBMIT / VALIDATION HANDLE --- //
	render() {
		const { isTest } = this.props;
		const styles = {
			block: {
				maxWidth: 250,
			},
			radioButton: {
				marginBottom: 16,
			},
		};


		if (isTest) {
			return null;
		}

		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<Formsy.Form
							onValidSubmit={this.handleSubmit}
						>
							<div className="comment-upper">
								<h1 className="add-comment-title">
									<DraftEditorInput
										name="draft_editor_tag_title"
										editorState={this.state.titleEditorState}
										onChange={this.onTitleChange}
										disableMentions
										placeholder="Tag . . ."
										spellcheck
										stripPastedStyles
										singleLine
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
								className="comment-lower clearfix"
								style={{ paddingTop: 20 }}
							>
								<DraftEditorInput
									name="draft_editor_tag_desc"
									editorState={this.state.textEditorState}
									onChange={this.onTextChange}
									placeholder="Tag description . . ."
									spellcheck
									stripPastedStyles
								/>
								<div className="comment-edit-action-button">
									<RaisedButton
										type="submit"
										label="Add Tag"
										labelPosition="after"
										onClick={this.handleSubmit}
										icon={<FontIcon className="mdi mdi-plus" />}
									/>
								</div>
							</div>
						</Formsy.Form>
					</article>

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

AddKeyword.propTypes = {
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	submitForm: PropTypes.func.isRequired,
	onTypeChange: PropTypes.func.isRequired,
	keywordsOptions: PropTypes.array,
	keyideasOptions: PropTypes.array,
	isTest: PropTypes.bool,

};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	commentersQuery,
	keywordsQuery,
	connect(mapStateToProps),
)(AddKeyword);
