import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Select from 'react-select';
import Keywords from '/imports/collections/keywords';
// import FlatButton from 'material-ui/FlatButton';

// https://github.com/JedWatson/react-select
// import 'react-select/dist/react-select.css';

AddCommentForm = React.createClass({

	propTypes: {
		selectedLineFrom: React.PropTypes.number.isRequired,
		selectedLineTo: React.PropTypes.number.isRequired,
		submitForm: React.PropTypes.func.isRequired,
		// titleValue: React.PropTypes.string.isRequired,
		// textValue: React.PropTypes.string.isRequired,
		// referenceValue: React.PropTypes.string.isRequired,
		// referenceLinkValue: React.PropTypes.string.isRequired,
		// keywordValue: React.PropTypes.array.isRequired,
		// keyideasValue: React.PropTypes.array.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			titleValue: '',
			textValue: '',
			referenceValue: '',
			referenceLinkValue: '',
			keywordValue: '',
			keyideasValue: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const keywordsOptions = [];
		const keywords = Keywords.find().fetch();
		keywords.forEach((word) => {
			keywordsOptions.push({
				value: word.slug,
				label: word.title,
			});
		});

		// TODO: key ideas
		const keyideasOptions = [];

		return {
			keywordsOptions,
			keyideasOptions,
		};
	},

	handleSubmit(event) {
		// TODO: form validation
		event.preventDefault();
		// TODO: update collection
		this.props.submitForm(this.state);
	},

	titleValueChange(event) {
		this.setState({
			titleValue: event.target.value,
		});
	},

	textValueChange(event) {
		this.setState({
			textValue: event.target.value,
		});
	},

	referenceValueChange(event) {
		this.setState({
			referenceValue: event.target.value,
		});
	},

	referenceLinkValueChange(event) {
		this.setState({
			referenceLinkValue: event.target.value,
		});
	},

	keywordsValueChange(val) {
		this.setState({
			keywordValue: val,
		});
	},

	keyideasValueChange(val) {
		this.setState({
			keyideasValue: val,
		});
	},

	renderSelectedLines() {
		if (this.props.selectedLineFrom > 0 && this.props.selectedLineTo === 0) {
			return (
				<h5>Selected line: {this.props.selectedLineFrom}</h5>
			);
		} else if (this.props.selectedLineFrom > 0 && this.props.selectedLineTo > 0) {
			return (
				<div>
					<h5>Selected lines: {this.props.selectedLineFrom} to {this.props.selectedLineTo}</h5>
				</div>
			);
		}
		return (
			<h5>No line selected</h5>
		);
	},

	render() {
		/*
		const keyideasOptions = [
			// TODO: pull keyideasOptions from collection in getMeteorData
			{ value: 'one', label: 'One' },
			{ value: 'two', label: 'Two' },
		];
		*/

		return (

			<div className="add-comment-form">

				<form id="addCommentForm" onSubmit={this.handleSubmit}>

					<TextField
						name="title"
						id="title"
						className="form-element"
						required
						floatingLabelText="Title"
						value={this.state.titleValue}
						onChange={this.titleValueChange}
					/>

					<TextField
						name="text"
						id="text"
						className="form-element"
						required
						floatingLabelText="Text"
						multiLine
						value={this.state.textValue}
						onChange={this.textValueChange}
					/>

					<TextField
						name="reference"
						id="reference"
						className="form-element"
						required={false}
						floatingLabelText="Reference"
						value={this.state.referenceValue}
						onChange={this.referenceValueChange}
					/>

					<TextField
						name="referenceLink"
						id="referenceLink"
						className="form-element"
						required={false}
						floatingLabelText="Reference Link"
						value={this.state.referenceLinkValue}
						onChange={this.referenceLinkValueChange}
					/>

					<h5>Keywords:</h5>

					<Select
						name="keywords"
						id="keywords"
						className="form-element"
						required={false}
						options={this.data.keywordsOptions}
						multi
						allowCreate
						value={this.state.keywordValue}
						onChange={this.keywordsValueChange}
					/>

					<h5>Key Ideas:</h5>

					<Select
						name="keyideas"
						id="keyideas"
						className="form-element"
						required={false}
						options={this.data.keyideasOptions}
						multi
						allowCreate
						value={this.state.keyideasValue}
						onChange={this.keyideasValueChange}
					/>

					{this.renderSelectedLines()}

					<RaisedButton
						type="submit"
						label="Add comment"
						labelPosition="after"
						icon={<FontIcon className="mdi mdi-plus" />}
					/>

				</form>

			</div>

		);
	},
});
