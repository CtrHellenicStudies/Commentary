CommentaryLayout = React.createClass({

	propTypes: {
		queryParams: React.PropTypes.object,
	},

	getInitialState() {
		const filters = this.createFilterFromQueryParams(this.props.queryParams);
		let selectedRevisionIndex = null;

		return {
			filters,
			skip: 0,
			limit: 10,
			selectedRevisionIndex,
		};
	},

	createFilterFromQueryParams(queryParams) {

		const filters = [];

		if ('_id' in queryParams) {
			filters.push({
				key: '_id',
				values: [this.props.queryParams._id],
			});
			if ('revision' in this.props.queryParams) {
				filters.push({
					key: 'revision',
					values: [Number(this.props.queryParams.revision)],
				});
			}
		}

		if ('textsearch' in this.props.queryParams) {
			filters.push({
				key: 'textsearch',
				values: [this.props.queryParams.textsearch],
			});
		}

		if ('keywords' in queryParams) {
			const keywords = [];

			this.props.queryParams.keywords.split(',').forEach((keyword) => {
				keywords.push({
					slug: keyword,
				});
			});

			filters.push({
				key: 'keywords',
				values: keywords,
			});
		}

		if ('commenters' in queryParams) {
			const commenters = [];

			this.props.queryParams.commenters.split(',').forEach((commenter) => {
				commenters.push({
					slug: commenter,
				});
			});

			filters.push({
				key: 'commenters',
				values: commenters,
			});
		}

		if ('works' in queryParams) {
			const works = [];

			this.props.queryParams.works.split(',').forEach((work) => {
				works.push({
					slug: work,
					title: Utils.capitalize(work),
				});
			});

			filters.push({
				key: 'works',
				values: works,
			});
		}

		if ('subworks' in queryParams) {
			const subworks = [];

			this.props.queryParams.subworks.split(',').forEach((subwork) => {
				const subworkNumber = parseInt(subwork, 10);

				if (!Number.isNaN(subworkNumber)) {
					subworks.push({
						title: subwork,
						n: subworkNumber,
					});
				}
			});


			filters.push({
				key: 'subworks',
				values: subworks,
			});
		}

		if ('lineFrom' in this.props.queryParams) {
			const lineFrom = parseInt(this.props.queryParams.lineFrom, 10);

			if (!Number.isNaN(lineFrom)) {
				filters.push({
					key: 'lineFrom',
					values: [lineFrom],
				});
			}
		}

		if ('lineTo' in this.props.queryParams) {
			const lineTo = parseInt(this.props.queryParams.lineTo, 10);

			if (!Number.isNaN(lineTo)) {
				filters.push({
					key: 'lineTo',
					values: [lineTo],
				});
			}
		}

		return filters;
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		let keywords = [],
			commenters = [],
			works = [],
			comments = [];

		let query = this.createQueryFromFilters(this.state.filters);

		// SUBSCRIPTIONS:
		const commentersSub = Meteor.subscribe('commenters'),
			keywordsSub = Meteor.subscribe('keywords'),
			worksSub = Meteor.subscribe('works'),
			commentsSub = Meteor.subscribe('comments', query, this.state.skip, this.state.limit);

		// FETCH DATA:
		keywords = Keywords.find().fetch();
		commenters = Commenters.find().fetch();
		works = Works.find({}, { sort: { order: 1 } }).fetch();
		comments = Comments.find({}, { sort: { 'work.order': 1, 'subwork.n': 1, lineFrom: 1, nLines: -1 } }).fetch();

		const subsReady = commentersSub.ready() && keywordsSub.ready() && worksSub.ready(); // check if all subscriptions ready - all data loaded

		return {
			keywords,
			commenters,
			works,
			subsReady,
			comments,
		};
	},

    createQueryFromFilters(filters) {
        const query = {};
        if (filters) {
            filters.forEach((filter) => {
                switch (filter.key) {
                    case '_id':
                        query._id = filter.values[0];
                        break;
                    case 'textsearch':
                        query.$text = {
                            $search: filter.values[0]
                        };
                        break;

                    case 'keywords':
                        var values = [];
                        filter.values.forEach(function(value) {
                            values.push(value.slug);
                        });
                        query['keywords.slug'] = {
                            $in: values
                        };
                        break;

                    case 'commenters':
                        var values = [];
                        filter.values.forEach(function(value) {
                            values.push(value.slug);
                        });
                        query['commenters.slug'] = {
                            $in: values
                        };
                        break;

                    case 'works':
                        var values = [];
                        filter.values.forEach(function(value) {
                            values.push(value.slug);
                        });
                        query['work.slug'] = {
                            $in: values
                        };
                        break;

                    case 'subworks':
                        var values = [];
                        filter.values.forEach(function(value) {
                            values.push(value.n);
                        });
                        query['subwork.n'] = {
                            $in: values
                        };
                        break;

                    case 'lineFrom':
                        // Values will always be an array with a length of one
                        query.lineFrom = query.lineFrom || {};
                        query.lineFrom.$gte = filter.values[0];
                        break;

                    case 'lineTo':
                        // Values will always be an array with a length of one
                        query.lineFrom = query.lineFrom || {};
                        query.lineFrom.$lte = filter.values[0];
                        break;
                }
            });
        }
        return query;
    },

    getFilterValue(filters, key) {
        let value = {};
        if (filters) {
            const filterKey = filters.find((filter) => {
                return filter.key === key;
            });
            if (filterKey) {
                value = filterKey.values[0];
            }
        }
        return value;
    },

    // --- BEGIN handle querParams --- //

	componentDidUpdate(prevProps, prevState) {
		let queryParams = {};
		this.state.filters.forEach((filter) => {
			filter.values.forEach((value) => {
				const updateQueryParams = this.updateQueryParams;
				switch(filter.key) {
					case 'works':
						queryParams = updateQueryParams(queryParams, filter.key, value.slug);
						break;
					case 'subworks':
						queryParams = updateQueryParams(queryParams, filter.key, value.title);
						break;
					case 'keywords':
						queryParams = updateQueryParams(queryParams, filter.key, value.slug);
						break;
					case 'commenters':
						queryParams = updateQueryParams(queryParams, filter.key, value.slug);
						break;
					case 'lineFrom':
						queryParams = updateQueryParams(queryParams, filter.key, value);
						break;
					case 'lineTo':
						queryParams = updateQueryParams(queryParams, filter.key, value);
						break;
					case 'textsearch':
						queryParams = updateQueryParams(queryParams, filter.key, value);
						break;
				}
			});
		});
		if (FlowRouter.path('/commentary/', {}, queryParams) != FlowRouter.current().path) {
			FlowRouter.go('/commentary/', {}, queryParams);
		}
	},

	updateQueryParams(queryParams, key, value) {
        if (queryParams[key]) {
            queryParams[key] = queryParams[key] + ',' + value;
        } else {
            queryParams[key] = value;
        };
        return queryParams;
    },

    // --- END handle querParams --- //

	loadMoreComments() {
		this.setState({
			limit: this.state.limit + 10,
		});
	},

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false,
			valueIsInFilter = false,
			filterValueToRemove,
			filterToRemove;

		filters.forEach( (filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;
				valueIsInFilter = false;

				filter.values.forEach((filterValue, j) => {
					if (filterValue._id === value._id) {
						valueIsInFilter = true;
						filterValueToRemove = j;
					} else if (filterValue.slug === value.slug) {
						valueIsInFilter = true;
						filterValueToRemove = j;
					}
				});

				if (valueIsInFilter) {
					filter.values.splice(filterValueToRemove, 1);
					if (filter.values.length === 0) {
						filterToRemove = i;
					}
				} else if (key === 'works') {
					filters[i].values = [value];
				} else {
					filters[i].values.push(value);
				}
			}
		});


		if (typeof filterToRemove !== 'undefined') {
			filters.splice(filterToRemove, 1);
		}

		if (!keyIsInFilter) {
			filters.push({
				key,
				values: [value],
			});
		}
		this.setState({
			filters,
			skip: 0,
		});
	},

	handleChangeTextsearch(textsearch) {
		const filters = this.state.filters;

		if (textsearch && textsearch.length) {
			let textsearchInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filters[i].values = [textsearch];
					textsearchInFilters = true;
				}
			});

			if (!textsearchInFilters) {
				filters.push({
					key: 'textsearch',
					values: [textsearch],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'textsearch') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		this.setState({
			filters,
		});
	},

	handleChangeLineN(e) {
		const filters = this.state.filters;

		if (e.from > 1) {
			let lineFromInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filters[i].values = [e.from];
					lineFromInFilters = true;
				}
			});

			if (!lineFromInFilters) {
				filters.push({
					key: 'lineFrom',
					values: [e.from],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineFrom') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}

		if (e.to < 2100) {
			let lineToInFilters = false;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filters[i].values = [e.to];
					lineToInFilters = true;
				}
			});

			if (!lineToInFilters) {
				filters.push({
					key: 'lineTo',
					values: [e.to],
				});
			}
		} else {
			let filterToRemove;

			filters.forEach((filter, i) => {
				if (filter.key === 'lineTo') {
					filterToRemove = i;
				}
			});

			if (typeof filterToRemove !== 'undefined') {
				filters.splice(filterToRemove, 1);
			}
		}


		this.setState({
			filters,
		});
	},

	render() {
		return (
			<div>
				{this.data.subsReady ? 
					<div className="chs-layout commentary-layout">

						<Header
							filters={this.state.filters}
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							handleChangeTextsearch={this.handleChangeTextsearch}
							works={this.data.works}
							keywords={this.data.keywords}
							commenters={this.data.commenters}
							initialSearchEnabled
		    			/>

						<Commentary
							filters={this.state.filters}
							toggleSearchTerm={this.toggleSearchTerm}
							loadMoreComments={this.loadMoreComments}
							comments={this.data.comments}
		    			/>

					</div>
				:
					<Spinner />
		        }
	        </div>
		);
	},

});
