import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {EditorState, ContentState, Modifier, RichUtils, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';

import createSingleLinePlugin from 'draft-js-single-line-plugin';
const singleLinePlugin = createSingleLinePlugin();

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();

const {
  // inline buttons
  ItalicButton, UnderlineButton,
  // block buttons
  ULButton
} = richButtonsPlugin;

AddRevision = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    propTypes: {
        submitForm: React.PropTypes.func.isRequired,
        comment: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        var revisionId = this.props.comment.revisions.length - 1;
        var revision = this.props.comment.revisions[revisionId]; // get newest revision
        return {
            revision: revision,

            titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
            textEditorState: EditorState.createWithContent(stateFromHTML(revision.text)),

            titleValue: '',
            textValue: '',
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {

        return {

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

    handleSubmit(event) {
        // TODO: form validation
        event.preventDefault();

        // var error = this.validateStateForSubmit();

        // this.setState({
        //     snackbarOpen: error.errors,
        //     snackbarMessage: error.errorMessage,
        // });
        // if (!error.errors) {
            this.props.submitForm(this.state);
        // };
    },

    selectRevision(event) {
        var revision = this.props.comment.revisions[event.currentTarget.id];
        this.setState({
            revision: revision,
            titleEditorState: EditorState.createWithContent(ContentState.createFromText(revision.title)),
            textEditorState: EditorState.createWithContent(stateFromHTML(revision.text)),
        });
    },

    removeRevision() { // TODO: delete
        console.log('this.state.revision', this.state.revision);
        Meteor.call('comment.remove.revision', this.props.comment._id, this.state.revision);
    },

    // validateStateForSubmit() {
    //     var errors = false;
    //     var errorMessage = "Missing comment data:"
    //     if(this.state.titleValue === ""){
    //         errors = true;
    //         errorMessage += " title,";
    //     };
    //     if(this.state.textValue === "<p><br></p>"){
    //         errors = true;
    //         errorMessage += " comment text,";
    //     };
    //     if(this.props.selectedLineFrom === 0){
    //         errors = true;
    //         errorMessage += " no line selected,";
    //     };
    //     if(errors === true) {
    //         errorMessage.slice(0,-1);
    //         errorMessage += ".";
    //     };
    //     return {
    //         errors: errors,
    //         errorMessage: errorMessage,
    //     };
    // },

    render() {

        var that = this;

        return (
					<div className="comments lemma-panel-visible">
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
                        <div className="comment-keywords">
                            {this.props.comment.keywords.map(function(keyword, i){
                                return <RaisedButton
                                        key={i}
                                        className="comment-keyword paper-shadow"
                                        onClick={self.addSearchTerm}
                                        data-id={keyword._id}
                                        label={(keyword.title || keyword.wordpressId)}
                                    />

                             })}
                        </div>
                        {/*TODO: this.props.comment.keyideas*/}

                    </div>
                    <div className="comment-lower" style={{paddingTop: 20}}>
                        <ItalicButton/>
                        <UnderlineButton/>
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
                            <h4>Secondary Source(s):</h4>
                            <p>
                                {this.props.comment.referenceLink ?
                                    <a href={this.props.comment.referenceLink} target="_blank" >
                                        {this.props.comment.reference}
                                    </a>
                                    :
                                    <span >
                                        {this.props.comment.reference}
                                    </span>
                                }
                            </p>
                        </div>

                        <div className="add-comment-button">
                            <RaisedButton
                                type="submit"
                                label="Add revision"
                                labelPosition="after"
                                onClick={this.handleSubmit}
                                icon={<FontIcon className="mdi mdi-plus" />}
                            />
                        </div>
                        {Roles.userIsInRole(Meteor.user(), ['developer']) ? /*TODO: delete*/
                            <div className="add-comment-button">
                                <RaisedButton
                                    type="submit"
                                    label="(developer only) Remove revision"
                                    labelPosition="after"
                                    onClick={this.removeRevision}
                                    icon={<FontIcon className="mdi mdi-minus" />}
                                />
                            </div>
                            :
                            ""
                        }

                    </div>

                    <div className="comment-revisions">
                        {this.props.comment.revisions.map(function(revision, i){
                            return <FlatButton
                                key={i}
                                id={i}
                                className="revision selected-revision"
                                onClick={that.selectRevision}
                                label={"Revision " + moment(revision.created).format('D MMMM YYYY')}
                                >

                            </FlatButton>

                        })}
                    </div>

                </article>

            </div>
					</div>

        );
    }
});
