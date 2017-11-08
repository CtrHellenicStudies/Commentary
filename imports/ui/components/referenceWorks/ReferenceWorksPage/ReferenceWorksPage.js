import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import muiTheme from '/imports/lib/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import ReferenceWorksList from '/imports/ui/components/referenceWorks/ReferenceWorksList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';

// models
import Settings from '/imports/models/settings';

// lib
import Utils from '/imports/lib/utils';


class ReferenceWorksPage extends React.Component {

	render() {
		const { settings } = this.props;

		if (!settings) {
			return <LoadingPage />;
		}

		Utils.setTitle(`Reference Works | ${settings.title}`);
		Utils.setDescription(`Reference Works for ${settings.title}`);
		Utils.setMetaImage(`${location.origin}/images/achilles_2.jpg`);

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page reference-works-page">
					<Header />
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
			</MuiThemeProvider>
		);
	}

}


ReferenceWorksPage.propTypes = {
	title: PropTypes.string.isRequired,
	settings: PropTypes.object,
};

const ReferenceWorksPageContainer = createContainer(() => {
	const settingsHandle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: settingsHandle.ready() ? Settings.findOne() : { title: '' }
	};
}, ReferenceWorksPage);

export default ReferenceWorksPageContainer;
