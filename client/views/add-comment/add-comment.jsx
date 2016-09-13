import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// https://github.com/JedWatson/react-select
import Select from 'react-select';
import 'react-select/dist/react-select.css';

AddComment = React.createClass({

    getInitialState(){
        return {};
    },

    mixins: [ReactMeteorData],

    getMeteorData(){
      return {
        titleValue: '',
        textValue: '',
        referenceValue: '',
        referenceLinkValue: '',
        keywordValue: '',
        keyideasValue: '',
      }
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    handleSubmit(event) {
      event.preventDefault();
      console.log('state', this.state);
    },

    titleValueChange(event) {
      this.setState({
        titleValue: event.target.value
      });
    },

    textValueChange(event) {
      this.setState({
        textValue: event.target.value
      });
    },

    referenceValueChange(event) {
      this.setState({
        referenceValue: event.target.value
      });
    },

    referenceLinkValueChange(event) {
      this.setState({
        referenceLinkValue: event.target.value
      });
    },

    keywordsValueChange(val) {
      this.setState({
        keywordValue: val
      });
    },

    keyideasValueChange(val) {
      this.setState({
        keyideasValue: val
      });
    },


  render() {

    var options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
    ];

    var modulesTest = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
        ]
    };

    return (

        <div className="add-comment">

            <form id="addCommentForm" onSubmit={this.handleSubmit}>

                <TextField
                    name="title"
                    id="title"
                    className="form-element"
                    required={true}
                    floatingLabelText="Title"
                    value={this.state.titleValue}
                    onChange={this.titleValueChange}
                />

                <TextField
                    name="text"
                    id="text"
                    className="form-element"
                    required={true}
                    floatingLabelText="Text"
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

                <Select
                    name="keywords"
                    id="keywords"
                    className="form-element"
                    required={false}
                    options={options}
                    multi={true}
                    allowCreate={true}
                    value={this.state.keywordValue}
                    onChange={this.keywordsValueChange}
                />

                <Select
                    name="keyideas"
                    id="keyideas"
                    className="form-element"
                    required={false}
                    value="one"
                    options={options}
                    multi={true}
                    allowCreate={true}
                    value={this.state.keyideasValue}
                    onChange={this.keyideasValueChange}
                />

                <input type="submit" value="Add Comment" />
                
            </form>

        </div>
        );
    }
});
