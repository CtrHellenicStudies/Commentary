import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import muiTheme from '/imports/lib/muiTheme';
import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import ReferenceWorksList from '/imports/ui/components/referenceWorks/ReferenceWorksList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';

// graphql
import { commentersQuery } from '/imports/graphql/methods/commenters';
import { referenceWorksQuery } from '/imports/graphql/methods/referenceWorks';
import { settingsQuery } from '/imports/graphql/methods/settings';

// models
import Settings from '/imports/models/settings';
import ReferenceWorks from '/imports/models/referenceWorks';
import Commenters from '/imports/models/commenters';

// lib
import Utils from '/imports/lib/utils';


class ReferenceWorkDetail extends Component {

	createMarkup() {
		let __html = '';
		const { desc } = this.props;
		if (this.props.referenceWork) {
			__html += '<p>';
			__html += desc ? desc.replace('\n', '</p><p>') : '';
			__html += '</p>';
		}
		return {
			__html,
		};
	}

	render() {
		const { referenceWork, commenters, settings } = this.props;
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
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

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
	slug: PropTypes.string.isRequired,
	referenceWork: PropTypes.object,
	settings: PropTypes.object,
	commenters: PropTypes.array,
	desc: PropTypes.string
};


const ReferenceWorkDetailContainer = createContainer(props => {

	const slug = props.match.params.slug;
	const tenantId = Session.get('tenantId');

	const referenceWork = props.referenceWorksQuery.loading ? undefined : props.referenceWorksQuery.referenceWorks.find(x => x.slug === slug && x.tenantId === tenantId);
	const tenantCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters.filter(x => x.tenantId === tenantId);
	let commenters = [];
	if (referenceWork && referenceWork.authors) {
		commenters = tenantCommenters.filter((x => 
			referenceWork.authors.find(y => y === x._id) !== undefined))
			.sort(function alphabetical(a, b) { return a > b; });
	}

	return {
		slug,
		referenceWork,
		commenters,
		settings: props.settingsQuery.loading ? { title: '' } : props.settingsQuery.settings.find(x => x.tenantId === tenantId),
	};
}, ReferenceWorkDetail);

export default compose(commentersQuery,
	referenceWorksQuery,
	settingsQuery)(ReferenceWorkDetailContainer);
