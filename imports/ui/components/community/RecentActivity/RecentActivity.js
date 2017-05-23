import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import muiTheme from '/imports/lib/muiTheme';
import RecentActivityList from '../RecentActivityList';


class RecentActivity extends React.Component {

	render() {
		return (
			<div className="recentActivity">
				<h3>Recent Community Activity</h3>
				<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
					<RecentActivityList />
				</MuiThemeProvider>
			</div>
		);
	}
}

export default RecentActivity;
