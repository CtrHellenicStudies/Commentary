import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';

// models
import Settings from '/imports/models/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';

// components
import CommunityMemberList from '../CommunityMemberList';


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
