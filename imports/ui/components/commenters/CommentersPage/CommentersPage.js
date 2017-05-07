import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import CommentersList from '/imports/ui/components/commenters/CommentersList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// api
import Settings from '/imports/api/collections/settings';

// lib
import Utils from '/imports/lib/utils';

const CommentersPage = React.createClass({
	propTypes: {
		settings: React.PropTypes.object,
	},

	render() {
		const { settings } = this.props;

		if (!settings) {
			return null;
		}

		Utils.setTitle(`Commentators | ${settings.title}`);
		Utils.setDescription(`Commentators for ${settings.title}`);
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

						<CommentersList />

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
