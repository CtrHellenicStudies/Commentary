import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import $ from 'jquery';
import _s from 'underscore.string';

// components
import KeywordContext from '../KeywordContext';
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder';
import KeywordCommentList from '../KeywordCommentList';
import CommentsRecent from '../../../comments/components/CommentsRecent';
import Header from '../../../../components/navigation/Header';
import Footer from '../../../../components/navigation/Footer';

// lib
import PageMeta from '../../../../lib/pageMeta';
import muiTheme from '../../../../lib/muiTheme';


import './KeywordDetail.css';


class KeywordDetail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
		};
	}

	_keywordDescriptionOnClick(e) {
		const $target = $(e.target); // eslint-disable-line
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
		this.setState({ // eslint-disable-line
			keywordReferenceModalVisible: false,
			referenceTop: 0,
			referenceLeft: 0,
			keyword: '',
		});
	}

	render() {
		const { keyword, settings, keywordComments, roles } = this.props;

		PageMeta.setTitle(`${keyword.title} | ${settings.title}`);
		if (keyword.description) {
			PageMeta.setDescription(_s.truncate(keyword.description, 150));
		}
		PageMeta.setMetaImage(`${window.location.origin}/images/apotheosis_homer.jpg`);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div>
					<Header />
					<div className="page keywords-page keywords-detail-page">
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
															onClick={this.props.deleteKeyword.bind(this)}
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
								{keyword.lemmaCitation?
									<KeywordContext
										keyword={keyword}
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
					<Footer />
				</div>
			</MuiThemeProvider>
		);
	}
}


KeywordDetail.propTypes = {
	keyword: PropTypes.object,
	settings: PropTypes.object,
	keywordComments: PropTypes.array,
	roles: PropTypes.array,
	deleteKeyword: PropTypes.func,
};

export default KeywordDetail;
