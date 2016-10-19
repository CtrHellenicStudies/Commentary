import '../../node_modules/mdi/css/materialdesignicons.css';

import slugify from 'slugify';

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

        if(commentSubscription.ready()) {
            comment = Comments.find().fetch()[0];
            // comment.commenters.forEach((commenter) => {
            // //     canShow = Roles.userIsInRole(Meteor.user(), [commenter.slug]);
            //     canShow = (Meteor.user().commenterId === commenter._id);
            // });
        };

        // console.log('Roles.subscription.ready()', Roles.subscription.ready());
        // console.log('Object.keys(this.data.comment).length', Object.keys(comment).length);
        // var ready = Roles.subscription.ready() && Object.keys(comment).length;

        return {
            // ready: ready,
            comment: comment,
        }
    },

    componentWillUpdate(nextProps, nextState) {
        this.handlePermissions();
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

    handlePermissions() {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter'])) {
                FlowRouter.go('/');
            };
        };
        if(Object.keys(this.data.comment).length){
            var isOwner = false;
            this.data.comment.commenters.forEach((commenter) => {
                if(!isOwner) {
                    isOwner = (Meteor.user().commenterId === commenter._id);
                };
            });
            if(!isOwner) {
                FlowRouter.go('/');
            };
        };
    },

    ifReady() {
        var ready = Roles.subscription.ready();
        ready = ready && Object.keys(this.data.comment).length;
        return ready;
    },

    render() {

        var comment = this.data.comment;

        return (
            <div>
                {this.ifReady() ?
                    <div className="chs-layout add-comment-layout">

                        <Header />

                            <main>

														<div className="commentary-comments">
															<div className="comment-group">
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
																</div>
															</div>


                            </main>

                        <Footer/>

                    </div>
                    :
                    <div className="ahcip-spinner commentary-loading full-page-spinner" >
                        <div className="double-bounce1"></div>
                        <div className="double-bounce2"></div>
                    </div>
                }
            </div>
        );
    }
});
