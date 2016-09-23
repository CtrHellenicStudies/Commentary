import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// https://github.com/JedWatson/react-select
import Select from 'react-select';
// import 'react-select/dist/react-select.css';

import {EditorState, ContentState, Modifier, RichUtils, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {stateToHTML} from 'draft-js-export-html';

import createSingleLinePlugin from 'draft-js-single-line-plugin';
const singleLinePlugin = createSingleLinePlugin();

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();

const {    
  // inline buttons 
  ItalicButton, BoldButton, MonospaceButton, UnderlineButton,
  // block buttons 
  OLButton, ULButton
} = richButtonsPlugin;

AddComment = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    propTypes: {
        selectedLineFrom: React.PropTypes.number,
        selectedLineTo: React.PropTypes.number,
        submiteForm: React.PropTypes.func.isRequired,
    },

    getInitialState(){
        return {
            titleEditorState: EditorState.createEmpty(),
            textEditorState: EditorState.createEmpty(),
            referenceEditorState: EditorState.createEmpty(),
            referenceLinkEditorState: EditorState.createEmpty(),

            titleValue: '',
            textValue: '',
            referenceValue: '',
            referenceLinkValue: '',
            keywordsValue: '',
            keyideasValue: '',

            snackbarOpen: false,
            snackbarMessage: ""
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var keywords_options = [];
        var keywords = Keywords.find().fetch();
        keywords.map(function(keyword) {
            keywords_options.push({
                value: keyword.title,
                label: keyword.title,
            });
        });
        
        // TODO: key ideas
        var keyideas_options = [];

        return {
            keywords_options: keywords_options,
            keyideas_options: keyideas_options,
            keywords: keywords,
        };
    },

    onTitleChange(titleEditorState) {
        var titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
        var title = jQuery(titleHtml).text();
        this.setState({
            titleEditorState: titleEditorState,
            titleValue: title,
        });
    },

    onTextChange(textEditorState) {
        var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
        this.setState({
            textEditorState: textEditorState,
            textValue: textHtml,
        });
    },

    onKeywordsValueChange(keywords) {
        if (keywords.length > 0) {
            this.setState({
                keywordsValue: keywords.split(","),
            });
        } else {
            this.setState({
                keywordsValue: null,
            });
        };
    },

    onKeywideasValueChange(keyideas) {
        // this.setState({
        //     keyideasValue: keyideas.split(","),
        // });
    },

    onReferenceValueChange(event) {
        this.setState({
            referenceValue: event.target.value
        });
    },

    onReferenceLinkValueChange(event) {
        this.setState({
            referenceLinkValue: event.target.value
        });
    },

    handleSubmit(event) {
        // TODO: form validation
        event.preventDefault();

        var error = this.validateStateForSubmit();

        this.setState({
            snackbarOpen: error.errors,
            snackbarMessage: error.errorMessage,
        });
        if (!error.errors) {
            this.props.submiteForm(this.state);
        };
    },

    validateStateForSubmit() {
        var errors = false;
        var errorMessage = "Missing comment data:"
        if(this.state.titleValue === ""){
            errors = true;
            errorMessage += " title,";
        };
        if(this.state.textValue === "<p><br></p>"){
            errors = true;
            errorMessage += " comment text,";
        };
        if(this.props.selectedLineFrom === 0){
            errors = true;
            errorMessage += " no line selected,";
        };
        if(errors === true) {
            errorMessage.slice(0,-1);
            errorMessage += ".";
        };
        return {
            errors: errors,
            errorMessage: errorMessage,
        };
    },

    // onMouseDown(event) {
    //     var selectedText = "";
    //     if (window.getSelection) {
    //         selectedText = window.getSelection();
    //     } else if (document.selection && document.selection.type != "Control") {
    //         selectedText = document.selection;
    //     };
    //     if(selectedText != "") {
    //         console.log('selectedText', selectedText);
    //         console.log('X position', event.pageX);
    //         console.log('Y position', event.target.offsetTop, event.target.offsetLeft);
    //     }
    // },

    // _onBoldClick() {
    //     this.onChange(RichUtils.toggleInlineStyle(
    //         this.state.editorState, 'BOLD'
    //     ));
    // },

    // _test() {
    //     var selection = window.getSelection();
    //     console.log('selection ', selection );
    // },

    // handleKeyCommand(command) {
    //     const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    //     if (newState) {
    //         this.onChange(newState);
    //         return 'handled';
    //     }
    //     return 'not-handled';
    // },

    // myBlockStyleFn(contentBlock) {
    //     const type = contentBlock.getType();
    //     if (type === 'unstyled') {
    //         return 'text-paragraph';
    //     }
    // },

    render() {

        // const raw = convertToRaw(this.state.titleEditorState.getCurrentContent());
        var titleHtml = stateToHTML(this.state.titleEditorState.getCurrentContent());
        var title = jQuery(titleHtml).text();

        const textRaw = convertToRaw(this.state.textEditorState.getCurrentContent());
        var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
        var text = jQuery(textHtml).text();
        // console.log('html', jQuery(html).text());


        return (
            <div className={'comment-outer'}>

                <article className="comment commentary-comment paper-shadow " style={{marginLeft: 0}}>

                    <div className="comment-upper">
                        <h1 className="add-comment-title">
                            <Editor
                                editorState={this.state.titleEditorState}
                                onChange={this.onTitleChange}
                                placeholder='Comment title...'
                                spellCheck={true}
                                stripPastedStyles={true}
                                plugins={[singleLinePlugin]}
                                blockRenderMap={singleLinePlugin.blockRenderMap}
                            />
                        </h1>
                        <Select
                            name="keywords"
                            id="keywords"
                            required={false}
                            options={this.data.keywords_options}
                            multi={true}
                            allowCreate={true}
                            value={this.state.keywordsValue}
                            onChange={this.onKeywordsValueChange}
                            placeholder='Keywords...'
                        />
                        <Select
                            name="keyideas"
                            id="keyideas"
                            required={false}
                            options={this.data.keywords_options /*TODO: change to keyideas_options*/}
                            multi={true}
                            allowCreate={true}
                            value={this.state.keyideasValue}
                            onChange={this.onKeywideasValueChange}
                            placeholder='Keyideas...'
                        />

                    </div>
                    <div className="comment-lower" style={{paddingTop: 20}}>
                        <BoldButton/>
                        <ItalicButton/>
                        <UnderlineButton/>
                        <OLButton/>
                        <ULButton/>
                        <div className="add-comment-text">
                            <Editor
                                editorState={this.state.textEditorState}
                                onChange={this.onTextChange}
                                placeholder='Comment text...'
                                spellCheck={true}
                                stripPastedStyles={true}
                                plugins={[richButtonsPlugin]}
                            />
                        </div>

                        <div className="comment-reference" >
                            {/*<h4>Secondary Source(s):
                            <Editor
                                editorState={this.state.referenceEditorState}
                                onChange={this.onReferenceChange}
                                placeholder='Reference...'
                                spellCheck={true}
                                stripPastedStyles={true}
                                plugins={plugins}
                                blockRenderMap={singleLinePlugin.blockRenderMap}
                            />
                            <Editor
                                editorState={this.state.referenceLinkEditorState}
                                onChange={this.onReferenceLinkChange}
                                placeholder='Reference link...'
                                spellCheck={true}
                                stripPastedStyles={true}
                                plugins={plugins}
                                blockRenderMap={singleLinePlugin.blockRenderMap}
                            />
                            
                            </h4>*/}


                            
                            {/*<p>
                                {comment.referenceLink ?
                                    <a href={comment.referenceLink} target="_blank" >
                                        {comment.reference}
                                    </a>
                                    :
                                    <span >
                                        {comment.reference}
                                    </span>
                                }
                            </p>*/}
                        {/* references input */}
                        </div>
                        <div>
                            <TextField
                                name="reference"
                                id="reference"
                                className="form-element"
                                required={false}
                                floatingLabelText="Reference..."
                                value={this.state.referenceValue}
                                onChange={this.onReferenceValueChange}
                            />
                        </div>
                        <div>
                            <TextField
                                name="referenceLink"
                                id="referenceLink"
                                className="form-element"
                                required={false}
                                floatingLabelText="Reference link..."
                                value={this.state.referenceLinkValue}
                                onChange={this.onReferenceLinkValueChange}
                            />
                        </div>
                        <div className="add-comment-button">
                            <RaisedButton 
                                type="submit"
                                label="Add comment"
                                labelPosition="after"
                                onClick={this.handleSubmit}
                                icon={<FontIcon className="mdi mdi-plus" />}
                            />
                        </div>
                    </div>

                </article>

                <Snackbar
                    className="add-comment-snackbar"
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={4000}
                />

            </div>

        );
    }
});
