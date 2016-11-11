import slugify from 'slugify';
import '../../node_modules/mdi/css/materialdesignicons.css';

AddCommentLayout = React.createClass({

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
		};
	},

	componentWillUpdate() {
		this.handlePermissions();
	},

	getMeteorData() {
		const keywords = Keywords.find().fetch();
		return {
			keywords,
		};
	},

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
		} else if (selectedLineTo != null && selectedLineTo != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		} else {
			// do nothing
		}
	},

	toggleSearchTerm(key, value) {
		const filters = this.state.filters;
		let keyIsInFilter = false;
		let valueIsInFilter = false;
		let filterValueToRemove;
		let filterToRemove;

		filters.forEach((filter, i) => {
			if (filter.key === key) {
				keyIsInFilter = true;

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

	addComment(formData) {
		const that = this;

		this.setState({
			loading: true,
		});

		const filters = this.state.filters;

		let work = null;
		let subwork = null;
		filters.forEach((filter) => {
			if (filter.key === 'work') {
				work = values[0];
			} else if (filter.key === 'subwork') {
				subwork = values[0];
			}
		});

		if (!work) {
			work = {
				title: 'Iliad',
				slug: 'iliad',
				order: 1,
			};
		}
		if (!subwork) {
			subwork = {
				title: 'Iliad',
				slug: 'iliad',
				n: 1,
			};
		}

		let lineLetter = '';
		if (this.state.selectedLineTo === 0 && this.state.selectedLineFrom > 0) {
			// checking if one line was selected
			lineLetter = this.commentLemmaSelect.state.lineLetterValue;
		}

		let referenceWorksInputObject = {};
		const referenceWorks = ReferenceWorks.find({
			slug: formData.referenceWorksValue,
		}, {
			limit: 1,
		}).fetch();


		if (referenceWorks.length) {
			referenceWorksInputObject = {
				revisionsCreated: referenceWorks[0].date,
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

		const commenter = Commenters.find({
			_id: Meteor.user().commenterId,
		}).fetch()[0];

		let selectedLineTo = 0;
		if (this.state.selectedLineTo === 0) {
			selectedLineTo = this.state.selectedLineFrom;
		} else {
			selectedLineTo = this.state.selectedLineTo;
		}

		this.addNewKeywordsAndIdeas(formData.keywordsValue, formData.keyideasValue, () => {
			const keywords = [];
			that.matchKeywords(formData.keywordsValue).forEach((matchedKeyword) => {
				keywords.push(matchedKeyword);
			});
			that.matchKeywords(formData.keyideasValue).forEach((matchedKeyword) => {
				keywords.push(matchedKeyword);
			});
			console.log('keywords', keywords);

			const comment = {
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
				lineTo: selectedLineTo,
				lineLetter,
				nLines: (that.state.selectedLineTo - that.state.selectedLineFrom) + 1,
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
					slug: commenter.slug,
				}];
			} else {
				comment.commenters = [{}];
			}

			if (keywords) {
				comment.keywords = keywords;
			} else {
				comment.keywords = [{}];
			}

			Meteor.call('comments.insert', comment, (error, commentId) => {
				FlowRouter.go(`/commentary/?_id=${commentId}`);
			});

			// TODO: handle behavior after comment added (add info about success)
		});
	},

	matchKeywords(keywords) {
		const matchedKeywords = [];
		if (keywords) {
			keywords.forEach((keyword) => {
				const foundKeyword = Keywords.find({
					title: keyword,
				}).fetch()[0];
				matchedKeywords.push(foundKeyword);
			});
		}
		return matchedKeywords;
	},

	addNewKeywordsAndIdeas(keywords, keyideas, next) {
		const that = this;
		this.addNewKeywords(keywords, 'word', () => {
			that.addNewKeywords(keyideas, 'idea', () => next());
		});
	},

	addNewKeywords(keywords, type, next) {
		if (keywords) {
			const that = this;
			const insertKeywords = [];
			keywords.forEach((keyword) => {
				foundKeyword = that.data.keywords.find((d) => d.title === keyword);
				console.log('foundKeyword', foundKeyword, 'keyword', keyword);
				if (foundKeyword === undefined) {
					const _keyword = {
						title: keyword,
						slug: slugify(keyword),
						type,
					};
					insertKeywords.push(_keyword);
				}
			});
			if (insertKeywords.length > 0) {
				return Meteor.call('keywords.insert', insertKeywords, (err) => {
					if (err) {
						console.log(err);
						return null;
					}
					return next();
				});
			}
			return next();
		}
		return next();
	},

	closeContextReader() {
		this.setState({
			contextReaderOpen: false,
		});
	},

	openContextReader() {
		this.setState({
			contextReaderOpen: true,
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
			}
		}
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

	ifReady() {
		const ready = Roles.subscription.ready();
		return ready;
	},

	render() {
		const filters = this.state.filters;
		let work;
		let subwork;
		let lineFrom;
		let lineTo;

		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			} else if (filter.key === 'subworks') {
				subwork = filter.values[0];
			} else if (filter.key === 'lineTo') {
				lineTo = filter.values[0];
			} else if (filter.key === 'lineFrom') {
				lineFrom = filter.values[0];
			}
		});

		console.log('AddCommentLayout.filters', this.state.filters);
		console.log('AddCommentLayout.state', this.state);

		return (
			<div>
				{this.ifReady() || this.state.loading ?
					<div className="chs-layout add-comment-layout">
						<div>
							<Header
								toggleSearchTerm={this.toggleSearchTerm}
								handleChangeLineN={this.handleChangeLineN}
								filters={this.state.filters}
								initialSearchEnabled
							/>

							<main>

								<div className="commentary-comments">
									<div className="comment-group">
										<CommentLemmaSelect
											ref={(component) => { this.commentLemmaSelect = component; }}
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
										/>

										<AddComment
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											submitForm={this.addComment}
										/>

										<ContextReader
											open={this.state.contextReaderOpen}
											workSlug={work ? work.slug : 'iliad'}
											subworkN={subwork ? subwork.n : 1}
											initialLineFrom={lineFrom || 1}
											initialLineTo={lineTo || 100}
											selectedLineFrom={this.state.selectedLineFrom}
											selectedLineTo={this.state.selectedLineTo}
											updateSelectedLines={this.updateSelectedLines}
										/>
									</div>
								</div>

								<FilterWidget
									filters={filters}
									toggleSearchTerm={this.toggleSearchTerm}
								/>

							</main>

							{/* <Footer/> */}

						</div>
					</div>
					:
					<div className="ahcip-spinner commentary-loading full-page-spinner">
						<div className="double-bounce1" />
						<div className="double-bounce2" />
					</div>
				}
			</div>
		);
	},
});
