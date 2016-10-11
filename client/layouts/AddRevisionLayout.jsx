import '../../node_modules/mdi/css/materialdesignicons.css';

import slugify from 'slugify';
import diffview from 'jsdifflib';


AddRevisionLayout = React.createClass({

    getInitialState() {
        return {
            // filters: [],

            // selectedLineFrom: 0,
            // selectedLineTo: 0,

            contextReaderOpen: true,
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var commentSubscription = Meteor.subscribe('comments', {_id: this.props.commentId}, 0, 1);
        var comment =  {};
        var canShow = false;

        if(commentSubscription.ready()) {
            comment = Comments.find().fetch()[0];
            comment.commenters.forEach((commenter) => {
            //     canShow = Roles.userIsInRole(Meteor.user(), [commenter.slug]);
                canShow = (Meteor.user().commenterId === commenter._id);
            });
        };

        if(Roles.userIsInRole(Meteor.user(), ['developer', 'admin'])) {
            canShow = true;
        };

        return {
            comment: comment,
            canShow: canShow,
        }
    },

    addRevision(formData) {

        var revision = {
            title: formData.titleValue,
            text: formData.textValue,
            created: new Date(),
            slug: slugify(formData.titleValue),
        };

        Meteor.call("comments.add.revision", this.props.commentId, revision, function(err) {
            FlowRouter.go('/commentary/?_id=' + this.data.comment._id);
        });

        // TODO: handle behavior after comment added (add info about success)
    },

    closeContextReader() {
        this.setState({
            contextReaderOpen: false
        });
    },

    openContextReader() {
        this.setState({
            contextReaderOpen: true
        });
    },

    getDiff(baseTextRaw, newTextRaw) {
        // build the diff view and return a DOM node 
        return diffview.buildView({
            baseText: baseTextRaw,
            newText: newTextRaw,
            // set the display titles for each resource 
            baseTextName: "Base Text",
            newTextName: "New Text",
            contextSize: 10,
            //set inine to true if you want inline 
            //rather than side by side diff 
            inline: false
        });
    },

    render() {

        var comment = this.data.comment;

        return (
            <div className="chs-layout add-comment-layout">

                <Header />

                {this.data.canShow && Object.keys(this.data.comment).length ? 

                    <main>

                        <CommentLemmnaSelect
                            ref="CommentLemmnaSelect"
                            selectedLineFrom={comment.lineFrom}
                            selectedLineTo={comment.lineFrom + comment.nLines - 1}
                            workSlug={comment.work.slug}
                            subwork_n={comment.subwork.n}
                            openContextReader={this.openContextReader}
                        />

                        <AddRevision
                            submiteForm={this.addRevision}
                            comment={comment}
                        />

                        <ContextReader
                            open={this.state.contextReaderOpen}
                            closeContextPanel={this.closeContextReader}
                            workSlug={comment.work.slug}
                            subwork_n={comment.subwork.n}
                            selectedLineFrom={comment.lineFrom}
                            selectedLineTo={comment.lineFrom + comment.nLines - 1}
                            initialLineFrom={comment.lineFrom}
                            initialLineTo={comment.lineFrom + comment.nLines - 1 + 50}
                            disableEdit={true}
                        />

                        {comment ? <div dangerouslySetInnerHTML={{__html: '<table class=\'table-diff\'>' + this.getDiff(comment.revisions[1].text, comment.revisions[2].text).innerHTML + '</table>'}} /> : ''}

                    </main>

                    :
                        <main style={{textAlign: 'center'}}>
                            <span>Permission denied. Access not grunted.</span>
                        </main>

                }
                
                <Footer/>

            </div>
        );
    }
});