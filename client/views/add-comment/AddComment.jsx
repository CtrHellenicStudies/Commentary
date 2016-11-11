import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// https://github.com/JedWatson/react-select
import Select from 'react-select';
// import 'react-select/dist/react-select.css';

import { EditorState, ContentState, Modifier, RichUtils, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';

import createSingleLinePlugin from 'draft-js-single-line-plugin';
const singleLinePlugin = createSingleLinePlugin();

import RichTextEditor from 'react-rte';


AddComment = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {
            muiTheme: getMuiTheme(baseTheme)
        };
    },

    propTypes: {
        selectedLineFrom: React.PropTypes.number,
        selectedLineTo: React.PropTypes.number,
        submitForm: React.PropTypes.func.isRequired,
        commenterId: React.PropTypes.array.isRequired,
    },

    getInitialState() {
        return {
            titleEditorState: EditorState.createEmpty(),
            textEditorState: RichTextEditor.createEmptyValue(),

            commenterValue: this.props.commenterId[0],
            // commenterValue: '',
            titleValue: '',
            textValue: '',
            referenceWorksValue: '',
            keywordsValue: null,
            keyideasValue: null,

            snackbarOpen: false,
            snackbarMessage: ""
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var keywords_options = [];
        var keywords = Keywords.find({
            type: 'word'
        }).fetch();
        keywords.map(function(keyword) {
            keywords_options.push({
                value: keyword.title,
                label: keyword.title,
            });
        });

        var keyideas_options = [];
        var keyideas = Keywords.find({
            type: 'idea'
        }).fetch();
        keyideas.map(function(keyidea) {
            keyideas_options.push({
                value: keyidea.title,
                label: keyidea.title,
            });
        });

        var referenceWorks_options = [];
        var referenceWorks = ReferenceWorks.find().fetch();
        referenceWorks.map(function(referenceWork) {
            referenceWorks_options.push({
                value: referenceWork.slug,
                label: referenceWork.title,
            });
        });

        let commenters_options = [];
        let commenters = Commenters.find({_id: { $in: this.props.commenterId}}).fetch();
        commenters.map(function(commenter) {
            commenters_options.push({
                value: commenter._id,
                label: commenter.name,
            });
        });

        return {
            keywords_options,
            keyideas_options,
            referenceWorks_options,
            commenters_options,
        };_
    },

    onCommenterValueChange(commenter) {
        if (commenter) {
            this.setState({
                commenterValue: commenter,
            });
        } else {
            this.setState({
                commenterValue: null,
            });
        }
        ;
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
        // var textHtml = stateToHTML(this.state.textEditorState.getCurrentContent());
        this.setState({
            textEditorState: textEditorState,
            textValue: textEditorState.toString('html'),
        });
    },

    onKeywordsValueChange(keywords) {
        if (keywords) {
            keywords = keywords.split(",");
            var errorKeywords = this.errorKeywords(keywords, 'word');
            if (errorKeywords.length) {
                errorKeywords.forEach((keyword) => {
                    var index = keywords.indexOf(keyword);
                    keywords.splice(index, 1);
                });
            }
            ;
            this.setState({
                keywordsValue: keywords,
            });
        } else {
            this.setState({
                keywordsValue: null,
            });
        }
        ;
    },

    onKeyideasValueChange(keyideas) {
        if (keyideas) {
            keyideas = keyideas.split(",");
            var errorKeywords = this.errorKeywords(keyideas, 'idea');
            if (errorKeywords.length) {
                errorKeywords.forEach((keyword) => {
                    var index = keyideas.indexOf(keyword);
                    keyideas.splice(index, 1);
                });
            }
            ;
            this.setState({
                keyideasValue: keyideas,
            });
        } else {
            this.setState({
                keyideasValue: null,
            });
        }
        ;
    },

    onReferenceWorksValueChange(referenceWork) {
        this.setState({
            referenceWorksValue: referenceWork
        });
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
        event.preventDefault();

        var error = this.validateStateForSubmit();
        this.showSnackBar(error);
        console.log('error', error);

        if (!error.errors) {
            this.props.submitForm(this.state);
        }
    },

    errorKeywords(keywordsArray, type) {
        // 'type' is the type of keywords passed to this function
        var errorKeywords = [];
        switch (type) {

            case 'word':
                var keyideasValue = this.state.keyideasValue;
                keywordsArray.forEach((keyword) => {
                    this.data.keyideas_options.forEach((keyidea_option) => {
                        if (keyword === keyidea_option.value) {
                            errorKeywords.push(keyword);
                        }
                        ;
                    });

                    if (Array.isArray(keyideasValue)) {
                        keyideasValue.forEach((keyideaValue) => {
                            if (keyword === keyideaValue) {
                                errorKeywords.push(keyword);
                            }
                            ;
                        });
                    }
                    ;
                });
                break;

            case 'idea': var keywordsValue = this.state.keywordsValue;
                keywordsArray.forEach((keyword) => {
                    this.data.keywords_options.forEach((keyword_option) => {
                        if (keyword === keyword_option.value) {
                            errorKeywords.push(keyword);
                        }
                        ;
                    });

                    if (Array.isArray(keywordsValue)) {
                        keywordsValue.forEach((keywordValue) => {
                            if (keyword === keywordValue) {
                                errorKeywords.push(keyword);
                            }
                            ;
                        });
                    }
                    ;
                });
                break;
        }
        ;
        return errorKeywords;
    },

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
    },

    validateStateForSubmit() {
        var errors = false;
        var errorMessage = "Missing comment data:";
        if (!this.state.titleValue) {
            errors = true;
            errorMessage += " title,";
        }
        if (this.state.textValue === "<p><br></p>" || !this.state.textValue) {
            errors = true;
            errorMessage += " comment text,";
        }
        if (!this.props.selectedLineFrom) {
            errors = true;
            errorMessage += " no line selected,";
        }
        if (!this.state.commenterValue) {
            errors = true;
            errorMessage += " no commenter selected,";
        }
        if (errors === true) {
            errorMessage = errorMessage.slice(0, -1);
            errorMessage += ".";
        }
        return {
            errors: errors,
            errorMessage: errorMessage,
        };
    },

    render() {

        const toolbarConfig = {
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [{
                label: 'Italic',
                style: 'ITALIC',
            }, {
                label: 'Underline',
                style: 'UNDERLINE'
            }],
            BLOCK_TYPE_BUTTONS: [{
                label: 'UL',
                style: 'unordered-list-item'
            }]
        };


        return (
            <div className="comments lemma-panel-visible">
              <div className={ 'comment-outer' }>
                <article
                  className="comment commentary-comment paper-shadow "
                  style={ { marginLeft: 0 } }
                >
                  <div className="comment-upper">
                    { this.data.commenters_options.length > 1 ?
                      <Select
                        name="commenter"
                        id="commenter"
                        required={ false }
                        options={ this.data.commenters_options }
                        value={ this.state.commenterValue }
                        onChange={ this.onCommenterValueChange }
                        placeholder='Commenter...'
                      />
                      :
                      "" }
                    <h1 className="add-comment-title">
                        <Editor
                          editorState={ this.state.titleEditorState }
                          onChange={ this.onTitleChange }
                          placeholder='Comment title...'
                          spellCheck={ true }
                          stripPastedStyles={ true }
                          plugins={ [singleLinePlugin] }
                          blockRenderMap={ singleLinePlugin.blockRenderMap }
                        />
                    </h1>
                    <Select
                      name="keywords"
                      id="keywords"
                      required={ false }
                      options={ this.data.keywords_options }
                      multi={ true }
                      allowCreate={ true }
                      value={ this.state.keywordsValue }
                      onChange={ this.onKeywordsValueChange }
                      placeholder='Keywords...'
                    />
                    <Select
                      name="keyideas"
                      id="keyideas"
                      required={ false }
                      options={ this.data.keyideas_options }
                      multi={ true }
                      allowCreate={ true }
                      value={ this.state.keyideasValue }
                      onChange={ this.onKeyideasValueChange }
                      placeholder='Keyideas...'
                    />
                  </div>
                  <div
                    className="comment-lower"
                    style={ { paddingTop: 20 } }
                  >
                    <RichTextEditor
                      placeholder='Comment text...'
                      value={ this.state.textEditorState }
                      onChange={ this.onTextChange }
                      toolbarConfig={ toolbarConfig }
                    />
                    <div className="comment-reference">
                      <Select
                        name="referenceWorks"
                        id="referenceWorks"
                        required={ false }
                        options={ this.data.referenceWorks_options }
                        value={ this.state.referenceWorksValue }
                        onChange={ this.onReferenceWorksValueChange }
                        placeholder='Reference...'
                      />
                    </div>
                    <div className="add-comment-button">
                      <RaisedButton
                        type="submit"
                        label="Add comment"
                        labelPosition="after"
                        onClick={ this.handleSubmit }
                        icon={ <FontIcon className="mdi mdi-plus" /> }
                      />
                    </div>
                  </div>
                </article>
                <Snackbar
                  className="add-comment-snackbar"
                  open={ this.state.snackbarOpen }
                  message={ this.state.snackbarMessage }
                  autoHideDuration={ 4000 }
                />
              </div>
            </div>
            );
    }
});
