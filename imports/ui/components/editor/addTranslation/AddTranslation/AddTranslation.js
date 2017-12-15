import React from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { EditorState, convertToRaw } from 'draft-js';
import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Formsy from 'formsy-react';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import { WorksDropdown, SubworksDropdown } from '/imports/ui/components/header/SearchDropdowns';
import { Creatable } from 'react-select';
import { Meteor } from 'meteor/meteor';


// graphql
import { commentersQuery } from '/imports/graphql/methods/commenters';
import { worksQuery } from '/imports/graphql/methods/works';

// lib
import muiTheme from '/imports/lib/muiTheme';
import DraftEditorInput from '../../../shared/DraftEditorInput/DraftEditorInput';


class AddTranslation extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	static defaultProps = {

		commentersOptions: []
	}

	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
			lineFromWork: '',
			lineFromSubwork: '',
			lineToSubwork: '',
			lineTo: '',
			lineFrom: '',
			commenterValue: {value: 'test'},
		};
		// this.onChange = (editorState) => this.setState({editorState});


		// methods
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
		this._enableButton = this._enableButton.bind(this);
		this._disableButton = this._disableButton.bind(this);
		this.onLineFromWorkChange = this.onLineFromWorkChange.bind(this);
		this.onLineFromSubworkChange = this.onLineFromSubworkChange.bind(this);
		this.onLineToWorkChange = this.onLineToWorkChange.bind(this);
		this.onLineToSubworkChange = this.onLineToSubworkChange.bind(this);
		this.onCommenterValueChange = this.onCommenterValueChange.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);

		this.props.commentersQuery.refetch({
			tenantId: sessionStorage.getItem('tenantId')
		});
	}
	componentWillReceiveProps(props) {

		const tenantId = sessionStorage.getItem('tenantId');
		const works = props.worksQuery.loading ? [] : props.worksQuery.works;
		const worksOptions = [];
		works.forEach((work) => {
			worksOptions.push({
				value: work._id,
				label: work.title,
				slug: work.slug,
				subworks: work.subworks
			});
		});
		const commentersOptions = [];
		const tenantCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters;
		let commenters = [];
		if (Meteor.user() && Meteor.user().canEditCommenters) {
			commenters = tenantCommenters.filter((x => 
				Meteor.user().canEditCommenters.find(y => y === x._id) !== undefined));
		}
		commenters.forEach((commenter) => {
			commentersOptions.push({
				value: commenter._id,
				label: commenter.name,
			});
		});

		this.setState({
			worksOptions,
			commentersOptions
		});
	}
	onEditorChange(editorState) {
		this.setState({
			editorState: editorState
		});
	}

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	}

	onLineFromWorkChange(lineFromWork) {
		this.setState({
			lineFromWork: lineFromWork
		});
	}

	onLineFromSubworkChange(lineFromSubwork) {
		this.setState({
			lineFromSubwork: lineFromSubwork
		});
	}

	onLineToWorkChange(lineToWork) {
		this.setState({
			lineToWork: lineToWork
		});
	}

	onLineToSubworkChange(lineToSubwork) {
		this.setState({
			lineToSubwork: lineToSubwork
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

	handleSubmit() {
		const error = this.validateStateForSubmit();

		this.showSnackBar(error);

		const textRaw = convertToRaw(this.state.editorState.getCurrentContent());

		if (!error.errors) {
			this.props.submitForm(this.state, textRaw);
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
		const errors = false;
		let errorMessage = 'Missing translation data:';

		if (errors === true) {
			errorMessage = errorMessage.slice(0, -1);
			errorMessage += '.';
		}

		return {
			errors,
			errorMessage,
		};
	}

	render() {
		const { isTest } = this.props;
		const { worksOptions, commentersOptions } = this.state;

		const getSubworks = () => {
			const subworks = [];
			this.state.lineFromWork.subworks.forEach((subwork) => {
				subworks.push({
					value: subwork.n,
					label: subwork.title,
					slug: subwork.slug,
				});
			});
			return subworks;
		};

		const toggleStyle = {
			style: {
				margin: '20px 0 0 0',
				paddingLeft: 15,
			},
		};

		if (isTest) {
			return null;
		}

		return (
			<div className="comments lemma-panel-visible comments--add-translation">
				<div className="comment-outer comment-outer--add-translation">
					<Formsy.Form
						onValid={this._enableButton}
						onInvalid={this._disableButton}
						onValidSubmit={this.handleSubmit}
					>
						<article className="comment commentary-comment paper-shadow">
							<div className="comment-upper" />
							<div className="comment-lower clearfix">
								<DraftEditorInput
									name="draft_input_translation"
									editorState={this.state.editorState}
									onChange={this.onEditorChange}
									disableMentions
									placeholder="Translation . . ."
									spellcheck
									stripPastedStyles
								/>
								<div className="comment-edit-action-button">
									<RaisedButton
										type="submit"
										label="Add translation"
										labelPosition="after"
										icon={<FontIcon className="mdi mdi-plus" />}
									/>
								</div>
							</div>
						</article>
					</Formsy.Form>
				</div>
			</div>
		);
	}
}

AddTranslation.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

AddTranslation.propTypes = {
	submitForm: PropTypes.func,
	isTest: PropTypes.bool,
	commentersQuery: PropTypes.object,
	worksQuery: PropTypes.object,
};

export default compose(
	worksQuery,
	commentersQuery,

)(AddTranslation);
