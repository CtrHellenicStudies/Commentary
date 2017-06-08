import React from 'react';
import PropTypes from 'prop-types'
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Formsy from 'formsy-react';

// lib
import muiTheme from '/imports/lib/muiTheme';

// Create toolbar plugin for editor

export default class AddTranslation extends React.Component {

	static propTypes: {
		selectedLineFrom: PropTypes.number,
		selectedLineTo: PropTypes.number,
		submitForm: PropTypes.func.isRequired,
		onTypeChange: PropTypes.func.isRequired,
		isTest: PropTypes.bool,
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	constructor(props) {
		super(props);
		this.state = {editorState: EditorState.createEmpty()};
		this.onChange = (editorState) => this.setState({editorState});

		// methods
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.validateStateForSubmit = this.validateStateForSubmit.bind(this);
		this._enableButton = this._enableButton.bind(this);
		this._disableButton = this._disableButton.bind(this);
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
		const { isTest } = this.props;

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



