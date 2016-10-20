import '../../node_modules/mdi/css/materialdesignicons.css';

import slugify from 'slugify';

AddRevisionLayout = React.createClass({

    getInitialState() {
        return {
            filters: [],

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

				const self = this;

        Meteor.call("comments.add.revision", this.props.commentId, revision, function(err) {
            FlowRouter.go('/commentary/?_id=' + self.data.comment._id);
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

    toggleSearchTerm(key, value) {
        var self = this,
            filters = this.state.filters;
        var keyIsInFilter = false,
            valueIsInFilter = false,
            filterValueToRemove,
            filterToRemove;

        filters.forEach(function(filter, i) {
            if (filter.key === key) {
                keyIsInFilter = true;

                filter.values.forEach(function(filterValue, j) {
                    if (filterValue._id === value._id) {
                        valueIsInFilter = true;
                        filterValueToRemove = j;
                    }
                })

                if (valueIsInFilter) {
                    filter.values.splice(filterValueToRemove, 1);
                    if (filter.values.length === 0) {
                        filterToRemove = i;
                    }
                } else {
                    if (key === "works") {
                        filter.values = [value];
                    } else {
                        filter.values.push(value);
                    }
                }
            }

        });


        if (typeof filterToRemove !== "undefined") {
            filters.splice(filterToRemove, 1);
        }

        if (!keyIsInFilter) {
            filters.push({
                key: key,
                values: [value]
            });
        }

        this.setState({
            filters: filters,
            skip: 0
        });

    },

		handleChangeLineN(e){

			const filters = this.state.filters;

			if(e.from > 1){
				let lineFromInFilters = false;

				filters.forEach(function(filter, i){
					if(filter.key === "lineFrom"){
						filter.values = [e.from];
						lineFromInFilters = true;
					}
				});

				if(!lineFromInFilters){
					filters.push({
						key:"lineFrom",
						values:[e.from]
					})
				}

			}else {
				let filterToRemove;

				filters.forEach(function(filter, i){
					if(filter.key === "lineFrom"){
						filterToRemove = i;
					}

				});

				if(typeof filterToRemove !== "undefined"){
					filters.splice(filterToRemove, 1);
				}

			}

			if(e.to < 2100){
				var lineToInFilters = false;

				filters.forEach(function(filter, i){
					if(filter.key === "lineTo"){
						filter.values = [e.to];
						lineToInFilters = true;
					}
				});

				if(!lineToInFilters){
					filters.push({
						key:"lineTo",
						values:[e.to]
					})
				}

			}else {
				let filterToRemove;

				filters.forEach(function(filter, i){
					if(filter.key === "lineTo"){
						filterToRemove = i;
					}

				});

				if(typeof filterToRemove !== "undefined"){
					filters.splice(filterToRemove, 1);
				}

			}


			this.setState({
				filters: filters
			})

		},


    ifReady() {
        var ready = Roles.subscription.ready();
        ready = ready && Object.keys(this.data.comment).length;
        return ready;
    },

    render() {

				const filters = this.state.filters;
        var comment = this.data.comment;

        return (
            <div>
                {this.ifReady() ?
                    <div className="chs-layout add-comment-layout">

                          <Header
                              toggleSearchTerm={this.toggleSearchTerm}
															handleChangeLineN={this.handleChangeLineN}
                              filters={filters}
                              initialSearchEnabled
                          />

                            <main>

														<div className="commentary-comments">
															<div className="comment-group">
                                <CommentLemmaSelect
                                    ref="CommentLemmaSelect"
                                    selectedLineFrom={comment.lineFrom}
                                    selectedLineTo={comment.lineFrom + comment.nLines - 1}
                                    workSlug={comment.work.slug}
                                    subworkN={comment.subwork.n}
                                />

                                <AddRevision
                                    submitForm={this.addRevision}
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

												<FilterWidget
													filters={filters}
													toggleSearchTerm={this.toggleSearchTerm}
												/>

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
