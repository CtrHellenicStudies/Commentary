CommentaryLayout = React.createClass({

	propTypes: {
		queryParams: React.PropTypes.object,
	},

	getInitialState() {
		const filters = [];
		const selectedRevisionIndex = null;

		console.log('this.props.queryParams', this.props.queryParams);

		if ('_id' in this.props.queryParams) {
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

		if ('keywords' in this.props.queryParams) {
			const keywords = [];

			this.props.queryParams.keywords.split(',').forEach((keyword) => {
				keywords.push({
					wordpressId: keyword,
				});
			});

			filters.push({
				key: 'keywords',
				values: keywords,
			});
		}

		if ('keyideas' in this.props.queryParams) {
			const keyideas = [];

			this.props.queryParams.keyideas.split(',').forEach((keyidea) => {
				keyideas.push({
					wordpressId: keyidea,
				});
			});

			filters.push({
				key: 'keyideas',
				values: keyideas,
			});
		}

		if ('commenters' in this.props.queryParams) {
			const commenters = [];

			this.props.queryParams.commenters.split(',').forEach((commenter) => {
				commenters.push({
					wordpressId: Number(commenter),
				});
			});

			filters.push({
				key: 'commenters',
				values: commenters,
			});
		}

		if ('works' in this.props.queryParams) {
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

		if ('subworks' in this.props.queryParams) {
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

		return {
			filters,
			skip: 0,
			limit: 10,
			selectedRevisionIndex,
		};
	},

	loadMoreComments() {
		this.setState({
			skip: this.state.skip + this.state.limit,
		});

		// console.log("Load more comments:", this.state.skip);
	},

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false;
		let	valueIsInFilter = false;
		let	filterValueToRemove;
		let	filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;
				valueIsInFilter = false;

				filter.values.forEach((filterValue, j) => {
					if (filterValue._id === value._id) {
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

	addSearchTerm(keyword) {
		console.log('keyword', keyword);
		this.toggleSearchTerm('keywords', keyword);
	},

	render() {
		console.log('CommentaryLayout.filters', this.state.filters);
		return (
			<div className="chs-layout commentary-layout">

				<Header
					filters={this.state.filters}
					toggleSearchTerm={this.toggleSearchTerm}
					handleChangeLineN={this.handleChangeLineN}
					handleChangeTextsearch={this.handleChangeTextsearch}
					initialSearchEnabled
				/>

				<Commentary
					filters={this.state.filters}
					toggleSearchTerm={this.toggleSearchTerm}
					loadMoreComments={this.loadMoreComments}
					skip={this.state.skip}
					limit={this.state.limit}
					addSearchTerm={this.addSearchTerm}
				/>

			</div>
		);
	},

});
