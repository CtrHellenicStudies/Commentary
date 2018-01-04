import React, { Component } from 'react';
import PropTypes from 'prop-types';

import muiTheme from '../../lib/muiTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { compose } from 'react-apollo';

// components
import BackgroundImageHolder from '../shared/BackgroundImageHolder';
import CommentersList from '../comenters/CommentersList';
import CommentsRecent from '../comments/commentsRecent/CommentsRecent';
import Header from '/imports/ui/layouts/header/Header';

// graphql
import { settingsQuery } from '../../graphql/methods/settings';

// lib
import Utils from '../../lib/utils';

class CommentersPage extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(nextProps) {
		const tenantId = sessionStorage.getItem('tenantId');
		const settings = nextProps.settingsQuery.loading ? { title: ''} : nextProps.settingsQuery.settings.find(x => x.tenantId === tenantId);
		this.setState({
			settings: settings
		});
	}
	render() {
		const { settings } = this.state;

		if (!settings) {
			return null;
		}

		Utils.setTitle(`Commentators | ${settings.title}`);
		Utils.setDescription(`Commentators for ${settings.title}`);
		Utils.setMetaImage(`${window.location.origin}/images/capitals.jpg`);
		return (
			<MuiThemeProvider>
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
	settingsQuery: PropTypes.object
};


export default compose(settingsQuery)(CommentersPage);
