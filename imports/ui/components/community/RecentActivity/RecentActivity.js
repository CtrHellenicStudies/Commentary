import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import RecentActivityList from '../RecentActivityList';


class RecentActivity extends React.Component {
	render() {
		return (
			<div className="recentActivity">
				<h3>Recent Community Activity</h3>
				<RecentActivityList />
			</div>
		);
	}
}

export default RecentActivity;
