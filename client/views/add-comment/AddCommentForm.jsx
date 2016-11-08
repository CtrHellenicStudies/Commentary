import {Tabs, Tab} from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import FontIcon from "material-ui/FontIcon";
import baseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Select from "react-select";
// import FlatButton from 'material-ui/FlatButton';

// https://github.com/JedWatson/react-select
// import 'react-select/dist/react-select.css';

AddCommentForm = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return {muiTheme: getMuiTheme(baseTheme)};
	},

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

	mixins: [ReactMeteorData],

	getMeteorData() {
		const keywords_options = [];
		const keywords = Keywords.find().fetch();
		keywords.map(function (word) {
			keywords_options.push({
				value: word.slug,
				label: word.title,
			});
		});

		// TODO: key ideas
		const keyideas_options = [];

		return {
			keywords_options,
			keyideas_options,
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
		} else {
			return (
				<h5>No line selected</h5>
			);
		}
	},

	render() {
		const keyideas_options = [
			// TODO: pull keyideas_options from collection in getMeteorData
			{value: 'one', label: 'One'},
			{value: 'two', label: 'Two'},
		];

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
						options={this.data.keywords_options}
						multi
						allowCreate
						value={this.state.keywordValue}
						onChange={this.keywordsValueChange}
					/>

					<h5>Keyideas:</h5>

					<Select
						name="keyideas"
						id="keyideas"
						className="form-element"
						required={false}
						value="one"
						options={this.data.keyideas_options}
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
						icon={<FontIcon className="mdi mdi-plus"/>}
					/>

				</form>

			</div>

		);
	},
});
