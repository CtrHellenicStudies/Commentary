import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { compose } from 'react-apollo';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import $ from 'jquery';

// https://github.com/JedWatson/react-select
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { fromJS } from 'immutable';
import Utils from '../../../../lib/utils';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/referenceWorksQuery';


// component
import DraftEditorInput from '../../../draftEditor/components/DraftEditiorInput/DraftEditorInput';

// Create toolbar plugin for editor
const singleLinePlugin = createSingleLinePlugin();

class EditKeyword extends Component {

	constructor(props) {
		super(props);
		const keyword = this.props.keyword;
		let keywordTitle = '';
		let keywordDescription = '';
		let description = '';

		if (keyword) {
			if (keyword && keyword.title) {
				keywordTitle = keyword.title;
			}

			if (keyword && keyword.description) {
				keywordDescription = keyword.description;
				description = this._getKeywordEditorState(keyword);
			} else {
				description = EditorState.createEmpty();
			}
		}
		this.state = {
			titleEditorState: EditorState.createWithContent(ContentState.createFromText(keywordTitle)),
			textEditorState: description,

			titleValue: keywordTitle,
			textValue: keywordDescription,

			snackbarOpen: false,
			snackbarMessage: '',
			suggestions: fromJS([])
		};
		const tenantId = sessionStorage.getItem('tenantId');
		this.props.referenceWorksQuery.refetch({
			tenantId: tenantId
		});

		this._getKeywordEditorState = this._getKeywordEditorState.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
		this.onTypeChange = this.onTypeChange.bind(this);
		this.onKeywordsValueChange = this.onKeyideasValueChange.bind(this);
		this.onNewOptionCreator = this.onNewOptionCreator.bind(this);
		this.shouldKeyDownEventCreateNewOption = this.shouldKeyDownEventCreateNewOption.bind(this);
		this.isOptionUnique = this.isOptionUnique.bind(this);
		this.onCommenterValueChange = this.onCommenterValueChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
	}
	componentWillReceiveProps(props) {
		const keywordsOptions = [];
		const keywords = !this.props.keywords ? [] : this.props.keywords
			.filter(x => x.type === 'word');
		keywords.forEach((keyword) => {
			keywordsOptions.push({
				value: keyword.title,
				label: keyword.title,
				slug: keyword.slug,
			});
		});
	
		const keyideasOptions = [];
		const keyideas = !this.props.keywords ? [] : this.props.keywords
			.filter(x => x.type === 'idea');
		keyideas.forEach((keyidea) => {
			keyideasOptions.push({
				value: keyidea.title,
				label: keyidea.title,
				slug: keyidea.slug,
			});
		});
		this.setState({
			keyideasOptions: keyideasOptions,
			keywordsOptions: keywordsOptions
		});
	}
	_getKeywordEditorState(keyword) {
		if (keyword.descriptionRaw && Object.keys(JSON.parse(keyword.descriptionRaw)).length) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(keyword.descriptionRaw)));
		} else if (keyword.description) {
			const blocksFromHTML = convertFromHTML(keyword.description);
			return EditorState.createWithContent(
				ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				)
			);
		}
		throw new Error('missing filed description or descriptionRaw in keyword');
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
	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	}
	handleSubmit(event) {
		const { textEditorState } = this.state;
		event.preventDefault();

		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		const descriptionHtml = Utils.getHtmlFromContext(textEditorState.getCurrentContent());

		const descriptionRaw = convertToRaw(textEditorState.getCurrentContent());

		if (!error.errors) {
			this.props.submitForm(this.state, descriptionHtml, descriptionRaw);
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
		let errorMessage = 'Missing comment data:';
		if (!this.state.titleValue) {
			errors = true;
			errorMessage += ' title,';
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

	// --- END SUBMIT / VALIDATION HANDLE --- //

	render() {
		const { keyword } = this.props;
		const styles = {
			block: {
				maxWidth: 250,
			},
			radioButton: {
				marginBottom: 16,
			},
		};

		if (!keyword) {
			return null;
		}

		return (
			<div className="comments lemma-panel-visible">
				<div className={'comment-outer'}>
					<article
						className="comment commentary-comment paper-shadow "
						style={{ marginLeft: 0 }}
					>
						<div className="comment-upper">
							<h1 className="add-comment-title">
								<DraftEditorInput
									editorState={this.state.titleEditorState}
									onChange={this.onTitleChange}
									placeholder="Key word or idea . . ."
									disableMentions
									spellcheck
									stripPastedStyles
									singleLinePlugin
									blockRenderMap={singleLinePlugin.blockRenderMap}
								/>
							</h1>
							<RadioButtonGroup
								className="keyword-type-toggle"
								name="type"
								defaultSelected={this.props.keyword.type}
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
								editorState={this.state.textEditorState}
								onChange={this.onTextChange}
								placeholder="Keyword description . . ."
								spellcheck
								stripPastedStyles
							/>
							<div className="comment-edit-action-button">
								<RaisedButton
									type="submit"
									label="Update Tag"
									labelPosition="after"
									onClick={this.handleSubmit}
									icon={<FontIcon className="mdi mdi-plus" />}
								/>
							</div>
						</div>

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
EditKeyword.propTypes = {
	submitForm: PropTypes.func.isRequired,
	onTypeChange: PropTypes.func.isRequired,
	keyword: PropTypes.object,
	selectedLineFrom: PropTypes.number,
	selectedLineTo: PropTypes.number,
	referenceWorksQuery: PropTypes.object,
	commentersQuery: PropTypes.object,
	keywords: PropTypes.array
};
export default compose(
	referenceWorksQuery,
	commentersQuery
)(EditKeyword);
