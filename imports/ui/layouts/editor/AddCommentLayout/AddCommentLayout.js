import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components:
import Header from '/imports/ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';
import Spinner from '/imports/ui/components/loading/Spinner';
import CommentLemmaSelect from '/imports/ui/components/editor/addComment/CommentLemmaSelect';
import AddComment from '/imports/ui/components/editor/addComment/AddComment';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

// api
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';


/*
 *	helpers
 */
const handlePermissions = () => {
	if (Roles.subscription.ready()) {
		if (!Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter'])) {
			FlowRouter.go('/');
		}
	}
};

const getReferenceWorks = (formData) => {
	let referenceWorks = null;
	if (formData.referenceWorksValue) {
		referenceWorks = ReferenceWorks.findOne({_id: formData.referenceWorksValue.value});
	}
	return referenceWorks;
};

const getCommenter = (formData) => {
	const commenter = Commenters.findOne({
		_id: formData.commenterValue.value,
	});
	return commenter;
};


const getKeywords = (formData) => {
	const keywords = [];

	formData.tagsValue.forEach((tag) => {
		const keyword = tag.keyword;
		keyword.isMentionedInLemma = tag.isMentionedInLemma;
		keywords.push(keyword);
	});
	return keywords;
};

const getFilterValues = (filters) => {
	const filterValues = {};

	filters.forEach((filter) => {
		if (filter.key === 'works') {
			filterValues.work = filter.values[0];
		} else if (filter.key === 'subworks') {
			filterValues.subwork = filter.values[0];
		} else if (filter.key === 'lineTo') {
			filterValues.lineTo = filter.values[0];
		} else if (filter.key === 'lineFrom') {
			filterValues.lineFrom = filter.values[0];
		}
	});

	return filterValues;
};


/*
 *	BEGIN AddCommentLayout
 */
class AddCommentLayout extends React.Component {
	static propTypes = {
		ready: React.PropTypes.bool,
	};

	static defaultProps = {
		ready: false,
	};
	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: ''
		};

		// methods:
		this.updateSelectedLines = this.updateSelectedLines.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);

		this.addComment = this.addComment.bind(this);
		this.getWork = this.getWork.bind(this);
		this.getSubwork = this.getSubwork.bind(this);
		this.getLineLetter = this.getLineLetter.bind(this);
		this.getSelectedLineTo = this.getSelectedLineTo.bind(this);
		this.closeContextReader = this.closeContextReader.bind(this);
		this.openContextReader = this.openContextReader.bind(this);
		this.lineLetterUpdate = this.lineLetterUpdate.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);
	}

	componentWillUpdate() {
		handlePermissions();
	}

	// --- BEGNI LINE SELECTION --- //

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
		} else if (selectedLineTo === null) {
			this.setState({
				selectedLineFrom,
			});
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
		} else {
			// do nothing
		}
	}

	toggleSearchTerm(key, value) {
		const { filters } = this.state;

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
	}

	// --- END LINE SELECTION --- //


	// --- BEGNI ADD COMMENT --- //

	addComment(formData, textValue, textRawValue) {
		this.setState({
			loading: true,
		});

		// get data for comment:
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const referenceWorks = formData.referenceWorks;
		const commenters = Utils.getCommenters(formData.commenterValue);
		const selectedLineTo = this.getSelectedLineTo();
		const token = Cookies.get('loginToken');

		// get keywords after they were created:
		const keywords = getKeywords(formData);
		console.log(keywords);
		console.log(formData);
		const revisionId = new Meteor.Collection.ObjectID();

		// create comment object to be inserted:
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
			lineFrom: this.state.selectedLineFrom,
			lineTo: selectedLineTo,
			lineLetter,
			nLines: (selectedLineTo - this.state.selectedLineFrom) + 1,
			revisions: [{
				_id: revisionId.valueOf(),
				title: formData.titleValue,
				text: textValue,
				textRaw: textRawValue,
				created: referenceWorks ? referenceWorks.date : new Date(),
				slug: slugify(formData.titleValue),
			}],
			commenters: commenters.length ? commenters : [{}],
			keywords: keywords || [{}],
			referenceWorks: referenceWorks,
			tenantId: Session.get('tenantId'),
			created: new Date(),
			status: 'publish',
		};

		Meteor.call('comments.insert', token, comment, (error, commentId) => {
			if (error) {
				console.error(error);
				return null;
			}

			FlowRouter.go('/commentary', {}, {_id: commentId});
		});
	}

	getWork() {
		let work = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			}
		});
		if (!work) {
			work = {
				title: 'Iliad',
				slug: 'iliad',
				order: 1,
			};
		}
		return work;
	}

	getSubwork() {
		let subwork = null;
		this.state.filters.forEach((filter) => {
			if (filter.key === 'subworks') {
				subwork = filter.values[0];
			}
		});
		if (!subwork) {
			subwork = {
				title: '1',
				n: 1,
			};
		}
		return subwork;
	}

	getLineLetter() {

		const { selectedLineTo, selectedLineFrom } = this.state;

		let lineLetter = '';
		if (selectedLineTo === 0 && selectedLineFrom > 0) {
			lineLetter = this.commentLemmaSelect.state ? this.commentLemmaSelect.state.lineLetterValue : null;
		}
		return lineLetter;
	}

	getSelectedLineTo() {

		const { selectedLineTo, selectedLineFrom } = this.state;

		let newSelectedLineTo = 0;
		if (selectedLineTo === 0) {
			newSelectedLineTo = selectedLineFrom;
		} else {
			newSelectedLineTo = selectedLineTo;
		}
		return newSelectedLineTo;
	}

	// --- END ADD COMMENT --- //

	closeContextReader() {
		this.setState({
			contextReaderOpen: false,
		});
	}

	openContextReader() {
		this.setState({
			contextReaderOpen: true,
		});
	}

	lineLetterUpdate(value) {
		this.setState({
			lineLetter: value,
		});
	}

	handleChangeLineN(e) {
		const { filters } = this.state;

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
	}

	render() {

		const { filters, loading, selectedLineFrom, selectedLineTo, contextReaderOpen } = this.state;
		const { work, subwork, lineFrom, lineTo } = getFilterValues(filters);

		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							selectedWork={this.getWork(filters)}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>
						<main>
							<div className="commentary-comments">
								<div className="comment-group">
									<CommentLemmaSelect
										ref={(component) => { this.commentLemmaSelect = component; }}
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
										workSlug={work ? work.slug : 'iliad'}
										subworkN={subwork ? subwork.n : 1}
									/>

									<AddComment
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
										submitForm={this.addComment}
										work={work}
									/>

									<ContextPanel
										open={contextReaderOpen}
										workSlug={work ? work.slug : 'iliad'}
										subworkN={subwork ? subwork.n : 1}
										lineFrom={lineFrom || 1}
										selectedLineFrom={selectedLineFrom}
										selectedLineTo={selectedLineTo}
										updateSelectedLines={this.updateSelectedLines}
										editor
									/>
								</div>
							</div>

							<FilterWidget
								filters={filters}
								toggleSearchTerm={this.toggleSearchTerm}
							/>
						</main>
					</div>
					:
					<Spinner fullPage />
				}
			</MuiThemeProvider>
		);
	}
}
/*
 *	END AddCommentLayout
 */

const AddCommentLayoutContainer = (() => {
	const ready = Roles.subscription.ready();
	return {
		ready,
	};
}, AddCommentLayout);

export default AddCommentLayoutContainer;
