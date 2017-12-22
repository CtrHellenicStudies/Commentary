import React, { Component } from 'react';
import PropTypes from 'prop-types';

import muiTheme from '/imports/lib/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '/imports/ui/layouts/header/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { compose } from 'react-apollo';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import ReferenceWorksList from '/imports/ui/components/referenceWorks/ReferenceWorksList';
import CommentsRecent from '/imports/ui/components/commentary/comments/CommentsRecent';
import LoadingPage from '/imports/ui/components/loading/LoadingPage';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';

// lib
import Utils from '/imports/lib/utils';


class ReferenceWorksPage extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			settings: nextProps.settingsQuery.loading ? { title: '' } : nextProps.settingsQuery.settings.find(x => x.tenantId === sessionStorage.getItem('tenantId'))
		});
	}
	render() {
		const { settings } = this.state;

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
	settingsQuery: PropTypes.object,
};
export default compose(settingsQuery)(ReferenceWorksPage);
