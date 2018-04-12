import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { compose } from 'react-apollo';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../../../lib/muiTheme';

import Header from '../../../../components/navigation/Header';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';
import commentersQuery from '../../graphql/queries/commentersQuery';


// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder/BackgroundImageHolder';
import LoadingPage from '../../../../components/loading/LoadingPage';
import CommenterReferenceWorks from '../CommenterReferenceWorks/CommenterReferenceWorks';
import CommenterVisualizations from '../CommenterVisualizations/CommenterVisualizations';
import CommentsRecent from '../../../comments/components/CommentsRecent';

// lib
import Utils from '../../../../lib/utils';

import './CommenterDetail.css';



class CommenterDetail extends Component {
	constructor(props) {
		super(props);
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		this.state = {
			readMoreBio: false,
			loggedIn: user,
			subscriptions: user && user.subscriptions
		};

		// methods:
		this.toggleReadMoreBio = this.toggleReadMoreBio.bind(this);
		this.subscribe = this.subscribe.bind(this);
	}

	toggleReadMoreBio() {
		const { readMoreBio } = this.state;

		this.setState({
			readMoreBio: !readMoreBio,
		});
	}

	subscribe() {
		// const { subscribed, commenter } = this.state;

		// const commenterObj = {
		// 	_id: commenter._id,
		// 	name: commenter.name,
		// 	bio: commenter.bio,
		// 	tagline: commenter.tagline,
		// 	updated: commenter.updated,
		// 	slug: commenter.slug,
		// 	avatar: {src: commenter.avatar.src},
		// 	subscribedOn: new Date()
		// };
		// TODO
		// if (!subscribed) {
		// 	Meteor.users.update({_id: Meteor.userId()}, {
		// 		$push: {
		// 			'subscriptions.commenters': commenterObj
		// 		}
		// 	});
		// } else {
		// 	Meteor.users.update({_id: Meteor.userId()}, {
		// 		$pull: {
		// 			'subscriptions.commenters': {_id: commenterObj._id}
		// 		}
		// 	});
		// }
		// this.setState({
		// 	subscribed: !subscribed
		// });
	}
	getBiographyHTML(biography) {
		if (Utils.isJson(biography)) {
			return JSON.parse(biography).html;
		}
		return biography;
	}
	componentWillReceiveProps(props) {
		const slug = props.match.params.slug;
		const tenantId = sessionStorage.getItem('tenantId');

		let avatarUrl;
		const commenter = props.commentersQuery.loading ? {} :
			props.commentersQuery.commenters.find(x => x.slug === slug && x.tenantId === tenantId);

		if (commenter && commenter.avatar) {
			avatarUrl = commenter.avatar.src;
		}
		this.setState({
			avatarUrl: avatarUrl,
			commenter: commenter,
			settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings
		});
	}
	render() {
		const { isTest } = this.props;
		const { readMoreBio, commenter, settings, avatarUrl } = this.state;

		if (commenter) {
			Utils.setTitle(`${commenter.name} | ${settings.title}`);
			Utils.setDescription(Utils.trunc(commenter.bio, 120));
			Utils.setMetaImage(avatarUrl);
		}

		return (
			(commenter ?
				<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
					<div className="page page-commenter-detail">
						<Header />
						<div className="content primary">
							<section className="block header cover parallax">
								<BackgroundImageHolder
									imgSrc="/images/capitals.jpg"
								/>
								<div className="container v-align-transform">
									<div className="grid inner">
										<div className="center-content">
											<div className="page-title-wrap">
												<h2 className="page-title ">
													{commenter.name}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section className="page-content">

								<div className="commenter-image">
									<img src={avatarUrl} alt={commenter.name} />
								</div>

								<div className={`user-bio ${(readMoreBio ? 'user-bio--read-more' : '')}`}>

									{commenter.bio ?
										<div dangerouslySetInnerHTML={{ __html: this.getBiographyHTML(commenter.bio) }} />
										:
										<p>There is no biography information for this user yet.</p>
									}


								</div>
								<div
									className={`read-more-toggle
									${(readMoreBio ? 'read-more-toggle-expanded' : '')}`}
								>
									<hr />
									{ commenter.bio && commenter.bio.length > 500 ?

										<div
											className="read-more-button"
											onClick={this.toggleReadMoreBio}
										>
											{readMoreBio ?
												<span className="read-less-text">
													Show Less
												</span>
												:
												<span className="read-more-text">
													Read More
												</span>
											}
										</div>
										:
										null
									}
								</div>

								<CommenterVisualizations
									commenter={commenter}
									isTest={isTest}
								/>

								<br />
								<br />
								<br />
								<hr />
							</section>

							<CommenterReferenceWorks
								commenter={commenter}
							/>

							<CommentsRecent />
						</div>
					</div>
				</MuiThemeProvider>
				:
				<LoadingPage />
			)
		);
	}
}
CommenterDetail.propTypes = {
	avatarUrl: PropTypes.string,
	settings: PropTypes.shape({
		title: PropTypes.string.isRequired,
	}),
	isTest: PropTypes.bool,
	match: PropTypes.object,
	commentersQuery: PropTypes.object,
	settingsQuery: PropTypes.object
};
CommenterDetail.defaultProps = {
	commenter: null,
	avatarUrl: null,
	isTest: false,
};
export default compose(
	commentersQuery,
	settingsQuery
)(CommenterDetail);
