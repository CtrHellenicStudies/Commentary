import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cookies from 'js-cookie';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../lib/muiTheme';

import Header from '../../components/header/Header';
import { compose } from 'react-apollo';
import $ from 'jquery';

// graphql
import { settingsQuery } from '../../graphql/methods/settings';
import { keywordsQuery, keywordRemoveMutation } from '../../graphql/methods/keywords';
import { commentsQuery } from '../../graphql/methods/comments';

// components
import KeywordContext from './KeywordContext';
import BackgroundImageHolder from '../shared/BackgroundImageHolder';
import KeywordCommentList from './KeywordsCommentList';
import CommentsRecent from '../comments/commentsRecent/CommentsRecent';

// lib
import Utils from '../../lib/utils';


class KeywordDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
			tenantId: sessionStorage.getItem('tenantId')
		};

		this.props.keywordsQuery.refetch({
			tenantId: this.state.tenantId
		});

	}
	componentWillReceiveProps(props) {
		const { match } = props;
		const slug = match.params.slug;
	
		const keyword = props.keywordsQuery.loading ? {} : props.keywordsQuery.keywords
			.find(x => x.slug === slug);
	
		let keywordComments = null;
		if (keyword) {
			const keywordCommentsQuery = { keywords: { $elemMatch: { _id: keyword._id } } };
			props.commentsQuery.refetch({
				queryParam: JSON.stringify(keywordCommentsQuery)
			});
			keywordComments = props.commentsQuery.loading ? [] : props.commentsQuery.comments;
		}
		this.setState({
			keyword,
			settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId),
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
											{Cookies.get('user') && Cookies.get('user').roles && Cookies.get('user').roles.length > 0 ?
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
KeywordDetail.propTypes = {
	settingsQuery: PropTypes.object,
	keywordsQuery: PropTypes.object,
	commentsQuery: PropTypes.object,
	history: PropTypes.object,
	keywordRemove: PropTypes.func,
	match: PropTypes.object
};
export default compose(
	settingsQuery,
	keywordsQuery,
	keywordRemoveMutation,
	commentsQuery
)(KeywordDetail);
