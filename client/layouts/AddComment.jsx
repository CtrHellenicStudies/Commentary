import {Tabs, Tab} from 'material-ui/Tabs';
// import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// https://github.com/JedWatson/react-select
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {EditorState, ContentState, Modifier, RichUtils, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {stateToHTML} from 'draft-js-export-html';

import createSingleLinePlugin from 'draft-js-single-line-plugin';
const singleLinePlugin = createSingleLinePlugin();

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();

const {
  // inline buttons
  ItalicButton,
} = richButtonsPlugin;

AddComment = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    propTypes: {

    },

    getInitialState(){
        return {
            titleEditorState: EditorState.createEmpty(),
            textEditorState: EditorState.createEmpty(),
            referenceEditorState: EditorState.createEmpty(),
            referenceLinkEditorState: EditorState.createEmpty(),
            keywordValue: '',
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var keywords_options = [];
        var keywords = Keywords.find().fetch();
        keywords.map(function(word) {
            keywords_options.push({
                value: word.slug,
                label: word.title,
            });
        });
        
        // TODO: key ideas
        var keyideas_options = [];

        return {
            keywords_options: keywords_options,
            keyideas_options: keyideas_options,
        }
    },

    onTitleChange(titleEditorState) {
        this.setState({
            titleEditorState: titleEditorState,
        })
    },

    onTextChange(textEditorState) {
        this.setState({
            textEditorState: textEditorState,
        })
    },

    onKeywordsChange(keywordsEditorState) {
        this.setState({
            keywordsEditorState: keywordsEditorState,
        })
    },

    onReferenceChange(referenceEditorState) {
        this.setState({
            referenceEditorState: referenceEditorState,
        })
    },

    onReferenceLinkChange(referenceLinkEditorState) {
        this.setState({
            referenceLinkEditorState: referenceLinkEditorState,
        })
    },

    keywordsValueChange(val) {
        this.setState({
            keywordValue: val
        });
    },

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
                                className="form-element"
                                required={false}
                                options={this.data.keywords_options}
                                multi={true}
                                allowCreate={true}
                                value={this.state.keywordValue}
                                onChange={this.keywordsValueChange}
                                placeholder='Keywords...'
                            />
                            {/*JSON.stringify(raw)*/}

                        </div>
                        <div className="comment-lower">
                            <ItalicButton/>{/*TODO: delete button*/}
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
                                <h4>Secondary Source(s):
                                {/*<Editor
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
                                />*/}
                                </h4>
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
                        </div>

                </article>

            </div>

        );
    }
});
