import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

const ReferenceWorksPage = React.createClass({

	propTypes: {
		title: React.PropTypes.string.isRequired,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

		return {
			settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
		};
	},

	render() {
		const { settings } = this.data;
		Utils.setTitle(`Reference Works | ${settings.title}`);
		Utils.setDescription(`Reference Works for ${settings.title}`);
		Utils.setMetaImage(`${location.origin}/images/achilles_2.jpg`);

		return (
			<div className="page reference-works-page">
				<div className="content primary">
					<section className="block header header-page	cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/achilles_2.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">Reference Works</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<ReferenceWorksList />
					</section>
					<CommentsRecent />
				</div>
			</div>
		);
	},

});

export default ReferenceWorksPage;
