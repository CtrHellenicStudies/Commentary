import '../../node_modules/mdi/css/materialdesignicons.css';

AddCommentLayout = React.createClass({

    getInitialState() {
        return {
            filters: [],
        };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {}
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

    addComment() {
        // TODO: pull data from AddCommentForm & ContextRreader
        // var work = Works.find({'slug': /*input work slug*/ }).fetch()[0];
        // var subwork = work.subwork[/*input subwork - 1*/];
        // Meteor.call("comments.insert", {
        //     test: true // to be deleted - easy to search added documents in comment collection and delete them
        //     wordpressId: // TODO: is it needed?
        //     commenters: // TODO: from login info
        //     work: {
        //         title: work.title,
        //         slug: work.slug,
        //         order: work.order,
        //     },
        //     subwork: {
        //         title: subwork.title,
        //         n: subwork.n,
        //     },
        //     lineFrom: // input lineFrom,
        //     lineTo: // input lineTo
        //     lineLetter: // what is this?
        //     nLines: // calsulate
        //     commentOrder: // what is this?
        //     keywords: // input keywords
        //     revisions: [{
        //         title: // input title
        //         text: // input text
        //         creted: // what info?
        //         slug: // how is it created?
        //     }],
        //     reference: // input reference
        //     referenceLink: // input referenceLink
        //     created: // date
        // });
    },

    render() {

        return (
            <div className="chs-layout add-comment-layout">

                <AddCommentHeader
                    toggleSearchTerm={this.toggleSearchTerm}
                />

                <main>

                    <div className="col-xs-6 add-comment">

                        <AddCommentForm 
                            
                        />

                        {this.state.filters.length > 1 ?
                            <ContextReader 
                                workSlug={this.state.filters[0].values[0].slug}
                                subwork_n={this.state.filters[1].values[0].n}
                            />
                        :
                            ''
                        }

                    </div>

            
                </main>
                
                <Footer/>

            </div>
        );
    }
});
