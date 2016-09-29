import '../../node_modules/mdi/css/materialdesignicons.css';

import slugify from 'slugify';

AddCommentLayout = React.createClass({

    getInitialState() {
        return {
            filters: [],

            selectedLineFrom: 0,
            selectedLineTo: 0,

            contextReaderOpen: true,
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var keywords = Keywords.find().fetch();
        return {
            keywords: keywords,
        }
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

        var work = Works.find({
            'slug': this.state.filters[0].values[0].slug
        }).fetch()[0];

        var subwork = work.subworks[this.state.filters[1].values[0].n - 1];

        var lineLetter = "";
        if(this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) { // checkingif one line was selected
            lineLetter = this.refs.CommentLemmnaSelect.state.lineLetterValue;
        };

        var referenceWorks = ReferenceWorks.find({slug: formData.referenceWorksValue}, {limit:1}).fetch();

        var referenceWorksInputObject = {};
        if(referenceWorks.length) {
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
        }

        var comment = {
            // commenters: // TODO: from login info
            work: {
                title: work.title,
                slug: work.slug,
                order: work.order,
            },
            subwork: {
                title: subwork.title,
                n: subwork.n,
            },
            lineFrom: this.state.selectedLineFrom,
            lineTo: this.state.selectedLineTo,
            lineLetter: lineLetter,
            nLines: this.state.selectedLineTo - this.state.selectedLineFrom + 1,
            // commentOrder: // what is this?
            keywords: formData.keywordsValue, // TODO: correct to fit schema
            revisions: [{
                title: formData.titleValue,
                text: formData.textValue,
                created: referenceWorksInputObject.revisionsCreated,
                slug: slugify(formData.titleValue),
            }],
            reference: referenceWorksInputObject.reference,
            referenceLink: referenceWorksInputObject.referenceLink,
            // created: // date
        };

        this.addNewKeyword(formData.keywordsValue);

        Meteor.call("comments.insert", comment);

        // TODO: handle behavior after comment added (route to commentary with with filter on new comment)
    },

    addNewKeyword(keywords) {
        if (keywords.length > 0) {
            var that = this;
            var insertKeywords = [];
            keywords.forEach(function(keyword) {
                var foundKeyword = that.data.keywords.find(function(d) {
                    return d.title === keyword;
                });
                if (foundKeyword === undefined) {
                    var _keyword = {
                        title: keyword,
                        slug: slugify(keyword),
                    };
                    insertKeywords.push(_keyword);
                };
            })
            if (insertKeywords.length > 0) {
                Meteor.call("keywords.insert", insertKeywords);
            };
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


    render() {

        return (
            <div className="chs-layout add-comment-layout">

                <Header
                    toggleSearchTerm={this.toggleSearchTerm}
                    initialSearchEnabled
                />

                <main>

                    <CommentLemmnaSelect
                        ref="CommentLemmnaSelect"
                        selectedLineFrom={this.state.selectedLineFrom}
                        selectedLineTo={this.state.selectedLineTo}
                        workSlug={this.state.filters.length > 0 ? this.state.filters[0].values[0].slug : 0}
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
        );
    }
});
