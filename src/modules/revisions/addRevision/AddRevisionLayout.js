import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import slugify from 'slugify';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../lib/muiTheme';

import Snackbar from 'material-ui/Snackbar';
import { handleChangeLineN, toggleSearchTerm } from './helper';

// components:
import Header from '../../../components/header/Header';
import FilterWidget from '../../filters/FilterWidget';
import CommentLemmaSelect from '../../comments/addComment/commentLemma/CommentLemmaSelect';
import AddRevision from './AddRevision';
import ContextPanel from '../../contextPanel/ContextPanel';

// graphql
import { keywordsQuery } from '../../../graphql/methods/keywords';
import { commentersQuery } from '../../../graphql/methods/commenters';
import { commentsQueryById,
	commentsUpdateMutation,
	commentAddRevisionMutation } from '../../../graphql/methods/comments';
import { textNodesQuery } from '../../../graphql/methods/textNodes';

// lib
import Utils from '../../../lib/utils';

class AddRevisionLayout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filters: [],
			contextReaderOpen: true,
			snackbarOpen: false,
			snackbarMessage: '',
			ready: false,
			refetchTextNodes: true,
			textNodes: []
		};

		this.addRevision = this.addRevision.bind(this);
		this.update = this.update.bind(this);
		this.getKeywords = this.getKeywords.bind(this);
		this.closeContextReader = this.closeContextReader.bind(this);
		this.openContextReader = this.openContextReader.bind(this);
		this.handlePermissions = this.handlePermissions.bind(this);
		this.toggleSearchTerm = this.toggleSearchTerm.bind(this);
		this.handleChangeLineN = this.handleChangeLineN.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.commentsQueryById.loading || 
			nextProps.keywordsQuery.loading || 
			nextProps.commentersQuery.loading ||
			nextProps.textNodesQuery.loading) {
			this.setState({
				ready: false
			});
			return;
		}
		
		const comment = nextProps.commentsQueryById.comments[0];
		const tenantCommenters = nextProps.commentersQuery.commenters;
		const commenters = [];
		if (comment) {
			comment.commenters.forEach((commenter) => {
				commenters.push(tenantCommenters.find(x =>
					x.slug === commenter.slug,
				));
			});
		}
		if (this.state.refetchTextNodes || nextProps.textNodesQuery.textNodes.length === 100) {
			const properties = Utils.getUrnTextNodesProperties(comment.lemmaCitation);
			this.props.textNodesQuery.refetch(properties);

			this.setState({
				refetchTextNodes: false
			});
			return;
		}
		const keywords = nextProps.keywordsQuery.keywords;
		this.setState({
			comment: comment,
			ready: !nextProps.commentsQueryById.loading && !nextProps.commentsQueryById.loading,
			keywords: keywords,
			commenters: commenters,
			textNodes: this.props.textNodesQuery.textNodes

		});
	}
	componentWillUpdate() {
		if (this.state.ready) this.handlePermissions();
	}
	addRevision(formData, textValue, textRawValue) {
		const { comment } = this.state;
		const now = new Date();
		const revision = {
			title: formData.titleValue,
			text: textValue,
			textRaw: textRawValue,
			created: new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()).toISOString(),
			slug: slugify(formData.titleValue),
		};
		const that = this;
		this.props.commentInsertRevision(comment._id, revision).then(function() {
			that.showSnackBar('Revision added');
			that.update(formData);
		});
	}
	update(formData) {
		const { comment } = this.state;

		const keywords = this.getKeywords(formData);

		let update = [{}];
		if (keywords) {
			update = {
				keywords,
				referenceWorks: formData.referenceWorks,
				commenters: Utils.getCommenters(formData.commenterValue, this.state.commenters)
			};
		}
		this.props.commentUpdate(comment.id, update).then(function() {
			this.props.history.push(`/commentary/${comment._id}/edit`);
		});
	}
	getKeywords(formData) {
		const keywords = [];

		formData.tagsValue.forEach((tag) => {
			const keyword = tag.keyword;
			keyword.isMentionedInLemma = tag.isMentionedInLemma;
			keywords.push(keyword);
		});
		return keywords;
	}
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
	handlePermissions() {
		if (this.state.comment && this.state.commenters.length) {
			const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
			let isOwner = false;
			this.state.commenters.forEach((commenter) => {
				if (!isOwner) {
					isOwner = (user && user.canEditCommenters.indexOf(commenter._id));
				}
			});
			if (!isOwner) {
				this.props.history.push('/');
			}
		}
	}
	toggleSearchTerm(key, value) {
		this.setState(toggleSearchTerm(key, value, this.state.filters));
	}
	handleChangeLineN(e) {
		this.setState({
			filters: handleChangeLineN(e, this.state.filters)
		});
	}
	showSnackBar(message) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: message,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}
	render() {
		const { ready, comment, filters, textNodes } = this.state;

		Utils.setTitle('Add Revision | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				{ready ?
					<div className="chs-layout chs-editor-layout add-comment-layout">

						<Header
							toggleSearchTerm={this.toggleSearchTerm}
							handleChangeLineN={this.handleChangeLineN}
							filters={filters}
							initialSearchEnabled
							addCommentPage
						/>

						<main>

							<div className="commentary-comments">
								<div className="comment-group">
									<CommentLemmaSelect
										ref={(component) => { this.commentLemmaSelect = component; }}
										lineFrom={comment.lineFrom}
										lineTo={(comment.lineFrom + comment.nLines) - 1}
										workSlug={comment.work.slug}
										subworkN={comment.subwork.n}
										textNodes={textNodes}
									/> 

									<AddRevision
										submitForm={this.addRevision}
										update={this.update}
										comment={comment}
									/>

									<ContextPanel
										open={this.state.contextReaderOpen}
										workSlug={comment.work.slug}
										subworkN={comment.subwork.n}
										lineFrom={comment.lineFrom}
										selectedLineFrom={comment.lineFrom}
										selectedLineTo={(comment.lineFrom + comment.nLines) - 1}
										editor
										disableEdit
									/>
								</div>
							</div>


						</main>

						<FilterWidget
							filters={filters}
							toggleSearchTerm={this.toggleSearchTerm}
						/>
						<Snackbar
							className="editor-snackbar"
							open={this.state.snackbarOpen}
							message={this.state.snackbarMessage}
							autoHideDuration={4000}
						/>

					</div>
					:
					<div className="ahcip-spinner commentary-loading full-page-spinner">
						<div className="double-bounce1" />
						<div className="double-bounce2" />
					</div>
				}

			</MuiThemeProvider>
		);
	}
}
AddRevisionLayout.propTypes = {
	history: PropTypes.object,
	commentUpdate: PropTypes.func,
	commentersQuery: PropTypes.object,
	commentsQueryById: PropTypes.object,
	keywordsQuery: PropTypes.object,
	match: PropTypes.object,
	textNodesQuery: PropTypes.object,
	commentInsertRevision: PropTypes.func

};

export default compose(
	commentersQuery,
	keywordsQuery,
	commentsQueryById,
	commentsUpdateMutation,
	commentAddRevisionMutation,
	textNodesQuery
)(AddRevisionLayout);
