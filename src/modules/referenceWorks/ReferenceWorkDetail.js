import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../lib/muiTheme';
import Header from '../../components/header/Header';

// components
import BackgroundImageHolder from '../shared/BackgroundImageHolder';
import CommentsRecent from '../comments/commentsRecent/CommentsRecent';
import LoadingPage from '../../components/loading/LoadingPage';

// graphql
import { commentersQuery } from '../../graphql/methods/commenters';
import { referenceWorksQuery } from '../../graphql/methods/referenceWorks';
import { settingsQuery } from '../../graphql/methods/settings';

// lib
import Utils from '../../lib/utils';


class ReferenceWorkDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(props) {

		const slug = props.match.params.slug;
		const tenantId = sessionStorage.getItem('tenantId');
	
		const referenceWork = props.referenceWorksQuery.loading ? undefined : props.referenceWorksQuery.referenceWorks.find(x => x.slug === slug && x.tenantId === tenantId);
		const tenantCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters.filter(x => x.tenantId === tenantId);
		let commenters = [];
		if (referenceWork && referenceWork.authors) {
			commenters = tenantCommenters.filter((x => 
				referenceWork.authors.find(y => y === x._id) !== undefined))
				.sort(function alphabetical(a, b) { return a > b; });
		}

		this.setState({
			slug,
			referenceWork,
			commenters,
			settings: props.settingsQuery.loading ? { title: '' } : props.settingsQuery.settings.find(x => x.tenantId === tenantId)
		});
	}
	createMarkup() {
		let __html = '';
		const { desc } = this.props;
		if (this.state.referenceWork) {
			__html += '<p>';
			__html += desc ? desc.replace('\n', '</p><p>') : '';
			__html += '</p>';
		}
		return {
			__html,
		};
	}

	render() {
		const { referenceWork, commenters, settings } = this.state;
		const commentersNames = [];
		let commentersTitle = '';

		if (commenters) {
			commenters.forEach((commenter) => {
				commentersNames.push(commenter.name);
			});
			commentersTitle = commenters.join(', ');
		}

		if (!referenceWork || !settings) {
			// TODO: Handle not found
			return <LoadingPage />;
		}

		Utils.setTitle(`${referenceWork.title} ${commentersTitle} | ${settings.title}`);
		Utils.setDescription(Utils.trunc(referenceWork.description, 150));
		Utils.setMetaImage(`${window.location.origin}/images/apotheosis_homer.jpg`);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page reference-works-page reference-works-detail-page">
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
											<h2 className="page-title ">{referenceWork.title}</h2>
											{referenceWork.link ?
												<a
													className="read-online-link"
													href={referenceWork.link}
													target="_blank"
													rel="noopener noreferrer"
												>
													Read Online <i className="mdi mdi-open-in-new" />
												</a>
											: ''}
										</div>
									</div>
								</div>
							</div>
						</section>

						<section className="page-content">

							{commenters && commenters.length ?
								<div className="page-byline">
									<h3>By {commenters.map((commenter, i) => {
										let ending = '';

										if (i < commenters.length - 2) {
											ending = ', ';
										} else if (i < commenters.length - 1) {
											ending = ' and ';
										}

										return (
											<span
												key={i}
											>
												<a
													href={`/commenters/${commenter.slug}`}
												>
													{commenter.name}
												</a>{ending}
											</span>
										);
									})}
									</h3>
								</div>
							: ''}

							<div
								dangerouslySetInnerHTML={this.createMarkup()}
							/>
						</section>

						<CommentsRecent />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}

}

ReferenceWorkDetail.propTypes = {
	desc: PropTypes.string,
	commentersQuery: PropTypes.object,
	referenceWorksQuery: PropTypes.object,
	settingsQuery: PropTypes.object,
	match: PropTypes.object
};
export default compose(
	commentersQuery,
	referenceWorksQuery,
	settingsQuery
)(ReferenceWorkDetail);
