import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Commenters from '/imports/api/collections/commenters';
import Settings from '/imports/api/collections/settings';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import CommenterReferenceWorks from '/imports/ui/components/commenters/CommenterReferenceWorks';
import CommenterVisualizations from '/imports/ui/components/commenters/CommenterVisualizations';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// lib
import Utils from '/imports/lib/utils';

class CommenterDetail extends React.Component {
	static propTypes = {
		commenter: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			bio: React.PropTypes.string,
		}),
		avatarUrl: React.PropTypes.string,
		settings: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
		}).isRequired,
		isTest: React.PropTypes.bool,
	};

	static defaultProps = {
		commenter: null,
		avatarUrl: null,
		isTest: false,
	};

	constructor(props) {
		super(props);
		
		this.state = {
			readMoreBio: false,
		};

		// methods:
		this.toggleReadMoreBio = this.toggleReadMoreBio.bind(this);
	}

	toggleReadMoreBio() {
		const { readMoreBio } = this.state;

		this.setState({
			readMoreBio: !readMoreBio,
		});
	}

	render() {
		const { commenter, settings, avatarUrl, isTest } = this.props;
		const { readMoreBio } = this.state;

		if (commenter) {
			Utils.setTitle(`${commenter.name} | ${settings.title}`);
			Utils.setDescription(Utils.trunc(commenter.bio, 120));
			Utils.setMetaImage(avatarUrl);
		}

		return (
			(commenter ?
				<div className="page page-commenter-detail">
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
									<div dangerouslySetInnerHTML={{ __html: commenter.bio }} />
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
				:
				<LoadingPage />
			)
		);
	}
}

export default createContainer(({ slug }) => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	const commentersHandle = Meteor.subscribe('commenters.slug', slug, Session.get('tenantId'));
	let avatarUrl;

	const commenter = Commenters.findOne({ slug });

	if (commenter && commenter.avatar) {
		avatarUrl = commenter.avatar.src;
	}

	return {
		commenter,
		avatarUrl,
		settings: Settings.findOne(),
		ready: settingsHandle.ready() && commentersHandle.ready(),
	};
}, CommenterDetail);
