import React from 'react';
import PropTypes from 'prop-types'
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Formsy from 'formsy-react';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import { WorksDropdown, SubworksDropdown } from '/imports/ui/components/header/SearchDropdowns';
import { Creatable } from 'react-select';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// api
import Works from '/imports/api/collections/works';

// lib
import muiTheme from '/imports/lib/muiTheme';


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
			commenterValue: {value: "test"},
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
		this.toggleInputLines = this.toggleInputLines.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);
	}

	onEditorChange(editorState) {
		this.setState({
			editorState: editorState
		})
	}

	toggleInputLines() {
		this.props.onToggleInputLinesChange()
	}

	onCommenterValueChange(comenter) {
		this.setState({
			commenterValue: comenter,
		});
	}

	onLineFromWorkChange(lineFromWork) {
		this.setState({
			lineFromWork: lineFromWork
		})
	}

	onLineFromSubworkChange(lineFromSubwork) {
		this.setState({
			lineFromSubwork: lineFromSubwork
		})
	}

	onLineToWorkChange(lineToWork) {
		this.setState({
			lineToWork: lineToWork
		})
	}

	onLineToSubworkChange(lineToSubwork) {
		this.setState({
			lineToSubwork: lineToSubwork
		})
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
			this.props.submitForm(this.state, textRaw)
		}
	}

	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}

	validateStateForSubmit() {
		let errors = false;
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
		const { isTest, worksOptions, commentersOptions, toggleInputLines, toggleInputLinesLabel, toggleInputLinesIsToggled } = this.props;

		const getSubworks = () => {
			const  subworks = [];
			this.state.lineFromWork.subworks.forEach((subwork) => {
				subworks.push({
					value: subwork.n,
					label: subwork.title,
					slug: subwork.slug,
				})
			})
			return subworks
		}

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
			<div className="comments lemma-panel-visible">
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
							</div>
							<div
								className="comment-lower clearfix"
								style={{ paddingTop: 20, paddingBottom: 20 }}
							>
								<Editor
									editorState={this.state.editorState}
									onChange={this.onEditorChange}
									placeholder="Translation . . ."
									spellCheck
									stripPastedStyles
								/>
							</div>
							<div className="comment-edit-action-button" />
							{toggleInputLinesIsToggled ?
								<div style={{paddingLeft: 45}}>
									<div>
										<h5>Line From</h5>
										<Creatable
											name="works"
											id="works"
											required={true}
											options={worksOptions}
											placeholder="Work"
											value={this.state.lineFromWork}
											onChange={this.onLineFromWorkChange}
										/>
										<Creatable
											name="subworks"
											id="subworks"
											required={true}
											options={this.state.lineFromWork !== '' ? getSubworks() : ''}
											placeholder="Subwork"
											value={this.state.lineFromSubwork}
											onChange={this.onLineFromSubworkChange}
										/>
										<TextField
											floatingLabelText="Line From"
										/>
									</div>
									<div>
										<h5>Line to</h5>
										<Creatable
											name="subworks"
											id="subworks"
											required={true}
											options={this.state.lineFromWork !== '' ? getSubworks() : ''}
											placeholder="Subwork"
											value={this.state.lineToSubwork}
											onChange={this.onLineToSubworkChange}
										/>
										<TextField
											floatingLabelText="Line to"
										/>
									</div>
								</div>
								: ''
							}
							<Toggle
								label={toggleInputLinesLabel}
								labelPosition="right"
								style={toggleStyle.style}
								toggled={toggleInputLinesIsToggled}
								onToggle={toggleInputLines}
							/>
							<RaisedButton
								type="submit"
								label="Add translation"
								labelPosition="after"
								icon={<FontIcon className="mdi mdi-plus" />}
							/>
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

const AddTranslationContainer = createContainer(() => {
	Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();
	const worksOptions = [];
	works.forEach((work) => {
		worksOptions.push({
			value: work._id,
			label: work.title,
			slug: work.slug,
			subworks: work.subworks
		});
	});

	Meteor.subscribe('commenters', Session.get('tenantId'));
	const commentersOptions = [];
	let commenters = [];
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		commenters = Commenters.find({ _id: { $in: Meteor.user().canEditCommenters } }).fetch();
	}
	commenters.forEach((commenter) => {
		commentersOptions.push({
			value: commenter._id,
			label: commenter.name,
		});
	});
	return {
		worksOptions,
		commentersOptions,
	};
}, AddTranslation);

export default AddTranslationContainer

