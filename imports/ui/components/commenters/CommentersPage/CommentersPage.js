import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import muiTheme from '/imports/lib/muiTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { compose } from 'react-apollo';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import CommentersList from '/imports/ui/components/commenters/CommentersList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';
import Header from '/imports/ui/layouts/header/Header';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';

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
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="page page-commenters">
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
			</MuiThemeProvider>
		);
	}
}

CommentersPage.propTypes = {
	settings: PropTypes.object
};

const commentersPageContainer = createContainer((props) => {

	const tenantId = Session.get('tenantId');
	const settings = props.settingsQuery.loading ? { title: ''} : props.settingsQuery.settings.find(x => x.tenantId === tenantId);

	return {
		settings: settings
	};
}, CommentersPage);


export default compose(settingsQuery)(commentersPageContainer);
