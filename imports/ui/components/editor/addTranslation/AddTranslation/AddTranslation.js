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
import Works from '/imports/api/collections/works';
// lib
import muiTheme from '/imports/lib/muiTheme';

// Create toolbar plugin for editor

class AddTranslation extends React.Component {

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
			inputLines: false,
			lineFromWork: '',
			lineFromSubwork: '',
			lineToWork: '',
			lineToSubwork: '',
			lineTo: '',
			lineFrom: ''
		};
		this.onChange = (editorState) => this.setState({editorState});


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
		const { isTest, worksOptions } = this.props;

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
							<div className="comment-upper" />
							<div
								className="comment-lower clearfix"
								style={{ paddingTop: 20, paddingBottom: 20 }}
							>
								<Editor
									editorState={this.state.editorState}
									onChange={this.onChange}
									placeholder="Translation . . ."
									spellCheck
									stripPastedStyles
								/>
							</div>
							<div className="comment-edit-action-button" />
							{this.state.inputLines ?
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
											options={worksOptions}
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
											name="works"
											id="works"
											required={true}
											options={worksOptions}
											placeholder="Work"
											value={this.state.lineToWork}
											onChange={this.onLineToWorkChange}
										/>
										<Creatable
											name="subworks"
											id="subworks"
											required={true}
											options={worksOptions}
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
								label={this.state.inputLines ? 'Input Lines' : 'Select Lines'}
								labelPosition="right"
								style={toggleStyle.style}
								toggled={this.state.inputLines}
								onToggle={(e) => this.setState({inputLines: !this.state.inputLines})}
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
		});
	});
	return {
		worksOptions
	};
}, AddTranslation);

export default AddTranslationContainer

