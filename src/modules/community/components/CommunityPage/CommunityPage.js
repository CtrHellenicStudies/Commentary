import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import BackgroundImageHolder from '../../../shared/components/BackgroundImageHolder/BackgroundImageHolder';
import RecentActivity from '../RecentActivity/RecentActivity';
import CommunityDirectory from '../CommunityDirectory/CommunityDirectory';

import './CommunityPage.css';


class CommunityPage extends Component {
	render() {
		return (
			<div className="page page-community content primary">
				<section className="block header header-page cover parallax">
					<BackgroundImageHolder
						imgSrc="/images/school-athens.jpg"
					/>

					<div className="container v-align-transform">
						<div className="grid inner">
							<div className="center-content">
								<div className="page-title-wrap">
									<h1 className="page-title">
										Community
									</h1>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="page-content container">
					<MuiThemeProvider>
						<Tabs>
							<Tab label="Recent Activity">
								<RecentActivity />
							</Tab>
							<Tab label="Community Directory">
								<CommunityDirectory />
							</Tab>
						</Tabs>
					</MuiThemeProvider>
				</section>

			</div>
		);
	}
}

export default CommunityPage;
