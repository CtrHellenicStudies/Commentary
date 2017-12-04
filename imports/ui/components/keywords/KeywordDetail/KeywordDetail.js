import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import autoBind from 'react-autobind';
import Cookies from 'js-cookie';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import { compose } from 'react-apollo';

// models
import Comments from '/imports/models/comments';
import Keywords from '/imports/models/keywords';
import Settings from '/imports/models/settings';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';
import { keywordsQuery, keywordRemoveMutation } from '/imports/graphql/methods/keywords';

// components
import KeywordContext from '/imports/ui/components/keywords/KeywordContext';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import KeywordCommentList from '/imports/ui/components/keywords/KeywordCommentList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


class KeywordDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: ''
		};
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	deleteKeyword() {
		const that = this;
		const { keyword } = this.props;
		this.props.keywordRemove(keyword._id).then(function() {
			that.props.history.push('/words');
		});
		// 	if (error) {
		// 		console.log(keywordId, error);
		// 	} else {
		// 		this.props.history.push('/words');
		// 	}
		// });
	}

	_keywordDescriptionOnClick(e) {
		const $target = $(e.target);
		const upperOffset = 90;
		if ($target.hasClass('keyword-gloss')) {
			const keyword = $target.data().link.replace('/tags/', '');
			this.setState({
				keywordReferenceModalVisible: true,
				referenceTop: $target.offset().top - upperOffset,
				referenceLeft: $target.offset().left + 160,
				keyword,
			});
		}
	}

	_closeKeywordReference() {
		this.setState({
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
		});
	}

	render() {
		const { keyword, settings, keywordComments } = this.props;

		if (!keyword) {
			return <div />;
		}

		Utils.setTitle(`${keyword.title} | ${settings.title}`);
		if (keyword.description) {
			Utils.setDescription(Utils.trunc(keyword.description, 150));
		}
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page keywords-page keywords-detail-page">
					<Header />
					<div className="content primary">
						<section className="block header header-page cover parallax">
							<BackgroundImageHolder
								imgSrc="/images/apotheosis_homer.jpg"
							/>

							<div className="container v-align-transform">
								<div className="grid inner">
									<div className="center-content">
										<div className="page-title-wrap">
											<h2 className="page-title ">{keyword.title}</h2>
											{Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter']) ?
												<div>
													<Link to={`/tags/${keyword.slug}/edit`}>
														<RaisedButton
															// href={`/tags/${keyword.slug}/edit`}
															className="cover-link light"
															label="Edit"
														/>
													</Link>
													<RaisedButton
														onClick={this.deleteKeyword.bind(this)}
														className="cover-link light"
														label="Delete"
													/>
												</div>
											: ''}
										</div>
									</div>
								</div>
							</div>
						</section>

						<section className="page-content">
							{keyword.lineFrom ?
								<KeywordContext keyword={keyword} />
							: ''}
							{(
								keyword.description
								&& keyword.description.length
								&& keyword.description !== '<p></p>'
							) ?
								<div
									className="keyword-description"
									dangerouslySetInnerHTML={{ __html: keyword.description }}
									onClick={this._keywordDescriptionOnClick}
								/>
							: ''}

							<hr />

							<h2>Related comments</h2>

							<KeywordCommentList
								keywordComments={keywordComments}
							/>

						</section>

						<CommentsRecent />

						{this.state.keywordReferenceModalVisible ?
							<KeywordReferenceModal
								visible={this.state.keywordReferenceModalVisible}
								top={this.state.referenceTop}
								left={this.state.referenceLeft}
								keywordSlug={this.state.keyword}
								close={this._closeKeywordReference}
							/>
						: ''}

					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}


KeywordDetail.propTypes = {
	keyword: PropTypes.object,
	settings: PropTypes.object,
	keywordComments: PropTypes.array,
	history: PropTypes.object,
	keywordRemove: PropTypes.func
};

KeywordDetail.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};


const KeywordDetailContainer = createContainer((props) => {

	const { match } = props;
	const slug = match.params.slug;
	const tenantId = Session.get('tenantId');

	if (tenantId) {
		props.keywordsQuery.refetch({
			tenantId: tenantId
		});
	}

	const keyword = props.keywordsQuery.loading ? {} : props.keywordsQuery.keywords
		.find(x => x.slug === slug);

	let keywordComments = null;
	if (keyword) {
		const keywordCommentsQuery = { keywords: { $elemMatch: { _id: keyword._id } } };
		Meteor.subscribe('comments', keywordCommentsQuery);

		keywordComments = Comments.find(keywordCommentsQuery).fetch();
	}

	return {
		keyword,
		settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === tenantId),
		keywordComments,
	};
}, KeywordDetail);

export default compose(
	settingsQuery,
	keywordsQuery,
	keywordRemoveMutation
)(KeywordDetailContainer);
