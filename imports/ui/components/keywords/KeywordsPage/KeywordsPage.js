import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';

const KeywordsPage = React.createClass({

	propTypes: {
		type: React.PropTypes.string.isRequired,
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
		const type = this.props.type;
		const { settings } = this.data;
		if (type === 'word') {
			Utils.setTitle(`Keywords | ${settings.title}`);
		} else {
			Utils.setTitle(`Key Ideas | ${settings.title}`);
		}
		Utils.setDescription(`${Utils.capitalize(this.props.type)} for ${Config.title}`);
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<div className="page keywords-page">
				<div data-ng-controller="PageController as page" className="content primary">
					<section className="block header header-page	cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/apotheosis_homer.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{this.props.title}</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<KeywordsList type={this.props.type} />
					</section>
				</div>
			</div>
		);
	},

});

export default KeywordsPage;
