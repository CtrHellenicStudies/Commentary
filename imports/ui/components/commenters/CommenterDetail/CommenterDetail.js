import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Commenters from '/imports/api/collections/commenters';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

const CommenterDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
		defaultAvatarUrl: React.PropTypes.string.isRequired,
		commenter: React.PropTypes.object,
		avatarUrl: React.PropTypes.string,
		settings: React.PropTypes.object,
	},

	getInitialState() {
		return {
			readMoreBio: false,
		};
	},

	getMeteorData() {
	},

	toggleReadMoreBio() {
		let readMoreBio = true;
		if (this.state.readMoreBio) {
			readMoreBio = false;
		}
		this.setState({
			readMoreBio,
		});
	},

	render() {
		const self = this;
		const { commenter, settings, avatarUrl } = this.props;

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

							<div className={`user-bio ${(self.state.readMoreBio ? 'user-bio--read-more' : '')}`}>

								{commenter.bio ?
									<div dangerouslySetInnerHTML={{ __html: commenter.bio }} />
									:
									<p>There is no biography information for this user yet.</p>
								}


							</div>
							<div
								className={`read-more-toggle
								${(self.state.readMoreBio ? 'read-more-toggle-expanded' : '')}`}
							>
								<hr />
								{ commenter.bio && commenter.bio.length > 500 ?

									<div
										className="read-more-button"
										onClick={this.toggleReadMoreBio}
									>
										{this.state.readMoreBio ?
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
									''
								}
							</div>

							<CommenterVisualizations
								commenter={commenter}
							/>

							<br />
							<br />
							<br />
							<hr />
							<br />
							<br />
							<br />

						</section>

						<CommenterReferenceWorks
							commenter={commenter}
						/>

						<CommentsRecent />
					</div>
				</div>
				:
				<Loading />
			)
		);
	},
});

export default createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	const commentersHandle = Meteor.subscribe('commenters.slug', this.props.slug, Session.get('tenantId'));

	const commenter = Commenters.findOne({ slug: this.props.slug });
	let avatarUrl = this.props.defaultAvatarUrl;

	if (commenter != null && commenter.avatar != null) {
		avatarUrl = commenter.avatar.src;
	}

	return {
		commenter,
		avatarUrl,
		settings: Settings.findOne(),
		ready: settingsHandle && commentersHandle,
	};
}, CommenterDetail);
