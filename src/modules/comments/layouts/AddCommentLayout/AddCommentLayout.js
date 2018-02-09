import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import Cookies from 'js-cookie';

import slugify from 'slugify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import qs from 'qs-lite';

// components:
import Header from '../../../../components/navigation/Header';
import Spinner from '../../../../components/loading/Spinner';
import FilterWidget from '../../../filters/components/FilterWidget/FilterWidget';
import CommentLemmaSelect from '../../components/CommentLemmaSelect';
import AddComment from '../../components/AddComment';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';

// graphql
import commentsInsertMutation from '../../graphql/mutations/insert';
import AddCommentContainer from '../../containers/AddCommentContainer/AddCommentContainer';
import serializeUrn from '../../../cts/lib/serializeUrn';


const getKeywords = (formData) => {

	const keywords = [];

	formData.tagsValue.forEach((tag) => {
		const keywordCopy = {};
		for (const [key, value] of Object.entries(tag.keyword)) {
			if (key === 'isMetionedInLemma') {
				keywordCopy[key] = tag.isMentionedInLemma;
			} else if (key !== '__typename') {
				keywordCopy[key] = value;
			}
		}
		keywords.push(keywordCopy);
	});
	return keywords;
};

/*
 *	BEGIN AddCommentLayout
 */
class AddCommentLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: '',
			selectedTextNodes: []
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
		this.handlePagination = this.handlePagination.bind(this);
		this.updateQuery = this.updateQuery.bind(this);
		this.getChildrenContext = this.getChildrenContext.bind(this);

		const { filters } = this.state;
		let work = 'tlg001';
		filters.forEach((filter) => {
			if (filter.key === 'works') {
				work = filter.values[0];
			}
		});
		this.setState({
			textNodesUrn: serializeUrn(Utils.createLemmaCitation(work ? work : 'tlg001', 0, 49)),
			work: work
		});
	}
	componentWillUpdate() {
		if (!Utils.userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}
	updateQuery() {
		this.setState({
			shouldUpdateQuery: false
		});
	}
	// --- BEGNI LINE SELECTION --- //

	updateSelectedLines(selectedLineFrom, selectedLineTo) {
		const { textNodes } = this.state;
		let finalFrom = 0, finalTo = 0;
		if (selectedLineFrom === null) {
			this.setState({
				selectedLineTo,
			});
			finalFrom = this.state.selectedLineFrom;
			finalTo = selectedLineTo;
		} else if (selectedLineTo === null || selectedLineFrom > selectedLineTo) {
			this.setState({
				selectedLineFrom: selectedLineFrom - 1,
				selectedLineTo: 0
			});
			finalFrom = selectedLineFrom - 1;
			finalTo = selectedLineFrom;
		} else if (selectedLineTo != null && selectedLineFrom != null) {
			this.setState({
				selectedLineFrom,
				selectedLineTo,
			});
			finalFrom = selectedLineFrom;
			finalTo = selectedLineTo;
		} else {
			return;
		}

		this.setState({
			selectedTextNodes: Utils.filterTextNodesBySelectedLines(textNodes, finalFrom, finalTo)
		});
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

	addComment(formData, possibleCommenters, textValue, textRawValue) {
		this.setState({
			loading: true,
		});

		// get data for comment:
		const work = this.getWork();
		const subwork = this.getSubwork();
		const lineLetter = this.getLineLetter();
		const referenceWorks = formData.referenceWorks;
		const commenters = Utils.getCommenters(formData.commenterValue, possibleCommenters);
		const selectedLineTo = this.getSelectedLineTo();
		const lemmaCitation = Utils.createLemmaCitation(work.slug, this.state.selectedLineFrom, selectedLineTo);

		// get keywords after they were created:
		const keywords = getKeywords(formData);
		const revisionId = Date.now();

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
			lemmaCitation: lemmaCitation,
			nLines: (selectedLineTo - this.state.selectedLineFrom) + 1,
			revisions: [{
				_id: revisionId.valueOf(),
				title: formData.titleValue,
				text: textValue,
				textRaw: textRawValue,
				created: referenceWorks ? referenceWorks.date : new Date(),
				slug: slugify(formData.titleValue),
			}],
			commenters: commenters.map(function(commenter) {
				const _commenter = JSON.parse(JSON.stringify(commenter));
				delete _commenter._id;
				delete _commenter.__typename;
				delete _commenter.avatar;
				delete _commenter.textRaw;
				return _commenter;
			}),
			keywords: keywords || [{}],
			referenceWorks: referenceWorks,
			tenantId: sessionStorage.getItem('tenantId'),
			// created: JSON.stringify(new Date()), TODO
			status: 'publish',
		};
		const that = this;
		this.props.commentInsert(comment).then((res) => {
			if (res.data.commentInsert._id) {
				const urlParams = qs.stringify({_id: res.data.commentInsert._id});
				that.props.history.push(`/commentary?${urlParams}`);
			} else {
				this.props.history.push(`/`);
			}
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
				slug: '001',
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

	handlePagination(book, chapter) {
		const { filters } = this.state;
		const work = this.getWork();

		filters.edition = book;
		filters.chapter = chapter;

		this.setState({
			filters,
		});
		let properties;
		if (work) {
			properties = {
				workUrn: work.urn,
				textNodesUrn: `${work.urn}:${chapter - 1}.1-${chapter}.1`
			}
		} else {
			properties = Utils.getUrnTextNodesProperties(Utils.createLemmaCitation('tlg001', 1, 1, chapter - 1, chapter));
		}
		this.setState({
			textNodesUrn: properties.textNodesUrn
		});
	}
	getChildrenContext() {
		return getMuiTheme(muiTheme);
	}
	render() {

		const { filters, loading } = this.state;
		const textNodesUrn = this.state.textNodesUrn ? this.state.textNodesUrn : 'urn:cts:greekLit:tlg0012.tlg001';

		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={this.getChildrenContext()}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handlePagination={this.handlePagination}
							selectedWork={this.getWork(filters)}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>
						<AddCommentContainer
							textNodesUrn={textNodesUrn}
							filters={filters} />
					</div>
					:
					<Spinner fullPage />
				}
			</MuiThemeProvider>
		);
	}
}
AddCommentLayout.propTypes = {
	commentInsert: PropTypes.func,
	history: PropTypes.object,
};

export default compose(
	commentsInsertMutation,
)(AddCommentLayout);
