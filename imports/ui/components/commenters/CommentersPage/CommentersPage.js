import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import CommentersList from '/imports/ui/components/commenters/CommentersList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';

// models
import Settings from '/imports/models/settings';

// lib
import Utils from '/imports/lib/utils';

class CommentersPage extends Component {

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
	}
}

CommentersPage.propTypes = {
	settings: React.PropTypes.object
};

const commentersPageContainer = createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
	};
}, CommentersPage);


export default commentersPageContainer;
