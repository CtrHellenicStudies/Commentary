import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

// components
import BackgroundImageHolder from '/imports/ui/components/shared/BackgroundImageHolder';
import RecentActivity from '/imports/ui/components/community/RecentActivity';
import CommunityDirectory from '/imports/ui/components/community/CommunityDirectory';


class CommunityPage extends React.Component {
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
					<Tabs>
						<Tab label="Recent Activity">
							<RecentActivity />
						</Tab>
						<Tab label="Community Directory">
							<CommunityDirectory />
						</Tab>
					</Tabs>
				</section>

			</div>
		);
	}
}

export default CommunityPage;
