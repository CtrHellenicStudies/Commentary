import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

const CommentersPage = React.createClass({

	render() {
		const { settings } = this.data;
		Utils.setTitle(`Commentators | ${settings.title}`);
		Utils.setDescription(`Commentators for ${Config.title}`);
		Utils.setMetaImage(`${location.origin}/images/capitals.jpg`);
		return (
			<div className="page page-commenters">
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
											Commentators
										</h2>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="page-content">

						<CommentersList defaultAvatarUrl="/images/default_user.jpg" />

					</section>

					<CommentsRecent />
				</div>

			</div>
		);
	},
});

const commentersPageContainer = createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
	};
}, CommentersPage);


export default commentersPageContainer;
