import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';

// lib
import muiTheme from '../../lib/muiTheme';

// components
import CommunityMemberList from './CommunityMemberList';


class CommunityDirectory extends React.Component {

	render() {

		return (
			<div className="communityDirectory">
				<h3>Community Directory</h3>
				<CommunityMemberList />
			</div>
		);
	}
}


export default CommunityDirectory;
