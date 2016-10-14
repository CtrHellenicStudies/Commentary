import '../../node_modules/mdi/css/materialdesignicons.css';

import slugify from 'slugify';

AddCommentLayout = React.createClass({

    getInitialState() {
        return {
            filters: [],

            selectedLineFrom: 0,
            selectedLineTo: 0,

            contextReaderOpen: true,

            loading: false,
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var keywords = Keywords.find().fetch();
        return {
            keywords: keywords,
        }
    },

    componentWillUpdate(nextProps, nextState) {
        this.handlePermissions();
    },

    updateSelecetedLines(selectedLineFrom, selectedLineTo) {
        if(selectedLineFrom === null) {
            this.setState({
                selectedLineTo: selectedLineTo,
            });
        } else if (selectedLineTo === null) {
            this.setState({
                selectedLineFrom: selectedLineFrom,
            });
        } else if (selectedLineTo != null && selectedLineTo != null) {
            this.setState({
                selectedLineFrom: selectedLineFrom,
                selectedLineTo: selectedLineTo,
            });
        } else {
            // do nothing
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

    addComment(formData) {

        var that = this;

        this.setState({
            loading: true,
        });

        var work = this.state.filters[0].values[0];
        var subwork = this.state.filters[1].values[0];

        var lineLetter = "";
        if (this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) { // checking if one line was selected
            lineLetter = this.refs.CommentLemmnaSelect.state.lineLetterValue;
        };

        var referenceWorks = ReferenceWorks.find({
            slug: formData.referenceWorksValue
        }, {
            limit: 1
        }).fetch();
        var referenceWorksInputObject = {};
        if (referenceWorks.length) {
            referenceWorksInputObject = {
                revisionsCreated: referenceWorks[0].created,
                reference: referenceWorks[0].title,
                referenceLink: referenceWorks[0].link,
            };
        } else {
            referenceWorksInputObject = {
                revisionsCreated: new Date(),
                reference: null,
                referenceLink: null,
            };
        };

        var commenter = Commenters.find({
            _id: Meteor.user().commenterId
        }).fetch()[0];

        this.addNewKeywordsAndIdeas(formData.keywordsValue, formData.keyideasValue, function() {
            var keywords = [];
            that.matchKeywords(formData.keywordsValue).forEach((matchedKeyword) => {
                keywords.push(matchedKeyword);
            });
            that.matchKeywords(formData.keyideasValue).forEach((matchedKeyword) => {
                keywords.push(matchedKeyword);
            });
            console.log('keywords', keywords);

            var comment = {
                work: {
                    title: work.title,
                    slug: work.slug,
                    order: work.order,
                },
                subwork: {
                    title: subwork.title,
                    n: subwork.n,
                },
                lineFrom: that.state.selectedLineFrom,
                lineTo: that.state.selectedLineTo,
                lineLetter: lineLetter,
                nLines: that.state.selectedLineTo - that.state.selectedLineFrom + 1,
                revisions: [{
                    title: formData.titleValue,
                    text: formData.textValue,
                    created: referenceWorksInputObject.revisionsCreated,
                    slug: slugify(formData.titleValue),
                }],
                reference: referenceWorksInputObject.reference,
                referenceLink: referenceWorksInputObject.referenceLink,
                created: new Date(),
            };

            if (commenter) {
                comment.commenters = [{
                    _id: commenter._id,
                    name: commenter.name,
                    slug: commenter.slug
                }];
            } else {
                comment.commenters = [{}];
            };

            if (keywords) {
                comment.keywords = keywords;
            } else {
                comment.keywords = [{}];
            };

            Meteor.call("comments.insert", comment, function(error, commentId) {
                FlowRouter.go('/commentary/?_id=' + commentId);
            });

            // TODO: handle behavior after comment added (add info about success)

        });


    },

    matchKeywords(keywords) {
        var matchedKeywords = [];
        if (keywords) {
            keywords.forEach((keyword) => {
                var foundKeyword = Keywords.find({
                    title: keyword
                }).fetch()[0];
                matchedKeywords.push(foundKeyword);
            });
        };
        return matchedKeywords;
    },

    addNewKeywordsAndIdeas(keywords, keyideas, next) {
        var that = this;
        this.addNewKeywords(keywords, 'word', function() {
            that.addNewKeywords(keyideas, 'idea', function() {
                return next();
            });
        });
    },

    addNewKeywords(keywords, type, next) {
        if (keywords) {
            var that = this;
            var insertKeywords = [];
            keywords.forEach(function(keyword) {
                foundKeyword = that.data.keywords.find(function(d) {
                    return d.title === keyword;
                });
                console.log('foundKeyword', foundKeyword, 'keyword', keyword);
                if (foundKeyword === undefined) {
                    var _keyword = {
                        title: keyword,
                        slug: slugify(keyword),
                        type: type,
                    };
                    insertKeywords.push(_keyword);
                };
            });
            if (insertKeywords.length > 0) {
                Meteor.call("keywords.insert", insertKeywords, function(err, data) {
                    if(err) {
                        console.log(err);
                    } else {
                        return next();
                    };
                });
            } else {
                return next();
            };
        } else {
            return next();
        };
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

    lineLetterUpdate(value) {
        this.setState({
            lineLetter: value,
        });
    },

    handlePermissions() {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter'])) {
                FlowRouter.go('/');
            };
        };
    },

    ifReady() {
        var ready = Roles.subscription.ready();
        return ready;
    },

    render() {

        return (
            <div>
                {this.ifReady() || this.state.loading ? 
                    <div className="chs-layout add-comment-layout">
                        <div>
                            <Header
                                toggleSearchTerm={this.toggleSearchTerm}
                                initialSearchEnabled
                                filters={this.state.filters}
                            />

                            <main>

                                <CommentLemmnaSelect
                                    ref="CommentLemmnaSelect"
                                    selectedLineFrom={this.state.selectedLineFrom}
                                    selectedLineTo={this.state.selectedLineTo}
                                    workSlug={this.state.filters.length > 0 ? this.state.filters[0].values[0].slug : ""}
                                    subwork_n={this.state.filters.length > 1 ? this.state.filters[1].values[0].n : 0}
                                    openContextReader={this.openContextReader}
                                />

                                <AddComment
                                    selectedLineFrom={this.state.selectedLineFrom}
                                    selectedLineTo={this.state.selectedLineTo}
                                    submiteForm={this.addComment}
                                />

                                <ContextReader
                                    open={this.state.contextReaderOpen}
                                    closeContextPanel={this.closeContextReader}
                                    workSlug={this.state.filters.length > 1 ? this.state.filters[0].values[0].slug : ""}
                                    subwork_n={this.state.filters.length > 1 ? this.state.filters[1].values[0].n : 0}
                                    selectedLineFrom={this.state.selectedLineFrom}
                                    selectedLineTo={this.state.selectedLineTo}
                                    updateSelecetedLines={this.updateSelecetedLines}
                                />

                            </main>
                            
                            <Footer/>
                        </div>
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
