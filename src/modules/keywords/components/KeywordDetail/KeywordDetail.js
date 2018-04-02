import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../../lib/muiTheme';

import Header from '../../../../components/navigation/Header/Header';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import $ from 'jquery';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';
import keywordsQuery from '../../graphql/queries/keywordsQuery';
import keywordRemoveMutation from '../../graphql/mutations/keywordsRemove';
import commentsQuery from '../../../comments/graphql/queries/comments';

// components
import KeywordContext from '../KeywordContext/KeywordContext';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder/BackgroundImageHolder';
import KeywordCommentList from '../KeywordsCommentList/KeywordsCommentList';
import CommentsRecent from '../../../comments/components/CommentsRecent/CommentsRecent';

// lib
import Utils from '../../../../lib/utils';

import './KeywordDetail.css';


class KeywordDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
			tenantId: sessionStorage.getItem('tenantId'),
			kewyord: {},
			keywordComments: [],
			settings: {}

		};

		this.props.keywordsQuery.refetch({
			tenantId: this.state.tenantId
		});

	}
	componentWillReceiveProps(props) {

		if (props.keywordsQuery.loading || props.commentsQuery.loading
			|| props.settingsQuery.loading) {
			return;
		}
		const { match } = props;
		const slug = match.params.slug;

		const keyword =  props.keywordsQuery.keywords.find(x => x.slug === slug);

		let keywordComments = null;
		if (keyword) {
			const keywordCommentsQuery = { keywords: { $elemMatch: { _id: keyword._id } } }; // TODO can be change for keywordId
			props.commentsQuery.refetch({
				queryParam: JSON.stringify(keywordCommentsQuery)
			});
			keywordComments = props.commentsQuery.comments;
		}
		this.setState({
			keyword,
			settings: props.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId),
			keywordComments,
		});
	}

	deleteKeyword() {
		const that = this;
		const { keyword } = this.state;
		this.props.keywordRemove(keyword._id).then(function() {
			that.props.history.push('/words');
		});
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
		const { keyword, settings, keywordComments } = this.state;
		const { roles } = this.props;
		console.log(roles);
		if (!keyword) {
			return <div />;
		}

		Utils.setTitle(`${keyword.title} | ${settings.title}`);
		if (keyword.description) {
			Utils.setDescription(Utils.trunc(keyword.description, 150));
		}
		Utils.setMetaImage(`${window.location.origin}/images/apotheosis_homer.jpg`);

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
											{roles && roles.length > 0 ?
												<div>
													<Link to={`/tags/${keyword.slug}/edit`}>
														<RaisedButton
															href={`/tags/${keyword.slug}/edit`}
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
								<KeywordContext
									keyword={keyword}
									lineFrom={this.state.lineFrom}
									lineTo={this.state.lineTo}
									workSlug={this.state.workSlug}
									subworkN={this.state.subworkN}
								/>
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

					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

const mapStateToProps = state => ({
	roles: state.auth.roles,
});

KeywordDetail.propTypes = {
	settingsQuery: PropTypes.object,
	keywordsQuery: PropTypes.object,
	commentsQuery: PropTypes.object,
	history: PropTypes.object,
	keywordRemove: PropTypes.func,
	match: PropTypes.object
};
export default compose(
	connect(mapStateToProps),
	settingsQuery,
	keywordsQuery,
	keywordRemoveMutation,
	commentsQuery
)(KeywordDetail);
