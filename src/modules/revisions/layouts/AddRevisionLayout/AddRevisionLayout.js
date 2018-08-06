import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import slugify from 'slugify';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';

// components
import Header from '../../../../components/navigation/Header';
import FilterWidget from '../../../filters/components/FilterWidget/FilterWidget';
import CommentLemmaSelect from '../../../comments/components/CommentLemmaSelect';
import AddRevisionContainer from '../../containers/AddRevisionContainer';
import ContextPanelContainer from '../../../contextPanel/containers/ContextPanelContainer';
import SnackbarContainer from '../../../shared/containers/SnackbarContainer';

// graphql
import commentsQueryById from '../../../comments/graphql/queries/commentsById';
import commentsUpdateMutation from '../../../comments/graphql/mutations/update';
import commentAddRevisionMutation from  '../../../comments/graphql/mutations/addRevision';
import keywordsQuery from '../../../keywords/graphql/queries/list';
import commentersQuery from '../../../commenters/graphql/queries/list';

// lib
import getCommentersFromFormInput from '../../../inputs/lib/getCommentersFromFormInput';
import muiTheme from '../../../../lib/muiTheme';
import PageMeta from '../../../../lib/pageMeta';


class AddRevisionLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			contextReaderOpen: true,
		};

		autoBind(this);
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
				commenters: getCommentersFromFormInput(formData.commenterValue, this.state.commenters)
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

	render() {
		PageMeta.setTitle('Add Revision | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<Header
						initialSearchEnabled
					/>
					<main>
						<div className="commentary-comments">
							<div className="comment-group">
								<CommentLemmaSelect
									ref={(component) => { this.commentLemmaSelect = component; }}
								/>
								<AddRevisionContainer />
								<ContextPanelContainer />
							</div>
						</div>
					</main>
					<FilterWidget />
					<SnackbarContainer />
				</div>
			</MuiThemeProvider>
		);
	}
}
AddRevisionLayout.propTypes = {
	commentUpdate: PropTypes.func,
	commentersQuery: PropTypes.object,
	commentsQueryById: PropTypes.object,
	keywordsQuery: PropTypes.object,
	commentInsertRevision: PropTypes.func
};

export default compose(
	commentersQuery,
	keywordsQuery,
	commentsQueryById,
	commentsUpdateMutation,
	commentAddRevisionMutation,
)(AddRevisionLayout);
