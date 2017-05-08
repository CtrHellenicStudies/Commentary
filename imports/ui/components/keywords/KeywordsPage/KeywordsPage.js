import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// lib
import Utils from '/imports/lib/utils';

// api
import Settings from '/imports/api/collections/settings';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';
import KeywordsList from '/imports/ui/components/keywords/KeywordsList';


const KeywordsPage = React.createClass({

	propTypes: {
		type: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		settings: React.PropTypes.object,
	},

	render() {
		const { title, type, settings } = this.props;

		if (!settings) {
			return <LoadingPage />;
		}

		if (type === 'word') {
			Utils.setTitle(`Keywords | ${settings.title}`);
		} else {
			Utils.setTitle(`Key Ideas | ${settings.title}`);
		}
		Utils.setDescription(`${Utils.capitalize(this.props.type)} for ${settings.title}`);
		Utils.setMetaImage(`${location.origin}/images/apotheosis_homer.jpg`);

		return (
			<div className="page keywords-page">
				<div className="content primary">
					<section className="block header header-page cover parallax">
						<BackgroundImageHolder
							imgSrc="/images/apotheosis_homer.jpg"
						/>

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{title}</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<KeywordsList type={type} />
					</section>
				</div>
			</div>
		);
	},

});

const KeywordsPageContainer = createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
	};
}, KeywordsPage);

export default KeywordsPageContainer;
