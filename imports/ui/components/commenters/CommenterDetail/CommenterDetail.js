import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import FlatButton from 'material-ui/FlatButton';
import { compose } from 'react-apollo';

import muiTheme from '/imports/lib/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';
import { commentersQuery } from '/imports/graphql/methods/commenters';

// models
import Commenters from '/imports/models/commenters';
import Settings from '/imports/models/settings';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import CommenterReferenceWorks from '/imports/ui/components/commenters/CommenterReferenceWorks';
import CommenterVisualizations from '/imports/ui/components/commenters/CommenterVisualizations';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// lib
import Utils from '/imports/lib/utils';

class CommenterDetail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			readMoreBio: false,
			loggedIn: Meteor.user(),
			subscriptions: Meteor.user() && Meteor.user().subscriptions
		};

		// methods:
		this.toggleReadMoreBio = this.toggleReadMoreBio.bind(this);
		this.subscribe = this.subscribe.bind(this);
	}

	static propTypes = {
		commenter: PropTypes.shape({
			name: PropTypes.string.isRequired,
			bio: PropTypes.string,
			_id: PropTypes.string
		}),
		avatarUrl: PropTypes.string,
		settings: PropTypes.shape({
			title: PropTypes.string.isRequired,
		}),
		isTest: PropTypes.bool,
	};

	static defaultProps = {
		commenter: null,
		avatarUrl: null,
		isTest: false,
	};

	toggleReadMoreBio() {
		const { readMoreBio } = this.state;

		this.setState({
			readMoreBio: !readMoreBio,
		});
	}

	subscribe() {
		const { subscribed } = this.state;
		const { commenter } = this.props;

		const commenterObj = {
			_id: commenter._id,
			name: commenter.name,
			bio: commenter.bio,
			tagline: commenter.tagline,
			updated: commenter.updated,
			slug: commenter.slug,
			avatar: {src: commenter.avatar.src},
			subscribedOn: new Date()
		};

		if (!subscribed) {
			Meteor.users.update({_id: Meteor.userId()}, {
				$push: {
					'subscriptions.commenters': commenterObj
				}
			});
		} else {
			Meteor.users.update({_id: Meteor.userId()}, {
				$pull: {
					'subscriptions.commenters': {_id: commenterObj._id}
				}
			});
		}
		this.setState({
			subscribed: !subscribed
		});
	}
	getBiographyHTML(biography) {
		if (Utils.isJson(biography))			{ return JSON.parse(biography).html; }
		return biography;
	}
	render() {
		const { commenter, settings, avatarUrl, isTest } = this.props;
		const { readMoreBio, subscribed, loggedIn } = this.state;

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

const cont = createContainer(props => {
	const slug = props.match.params.slug;
	const tenantId = sessionStorage.getItem('tenantId');

	let avatarUrl;

	const commenter = props.commentersQuery.loading ? {} : 
		props.commentersQuery.commenters.find(x => x.slug === slug && x.tenantId === tenantId);

	if (commenter && commenter.avatar) {
		avatarUrl = commenter.avatar.src;
	}

	return {
		commenter,
		avatarUrl,
		settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings,
		ready: !props.settingsQuery.loading || !props.commentersQuery.loading
	};
}, CommenterDetail);
export default (commentersQuery, settingsQuery)(cont);
