import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';

// layouts & components
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';
import { SnackAttack } from '/imports/ui/components/shared/SnackAttack';
import LoadingHome from '/imports/ui/components/loading/LoadingHome';

// api
import Settings from '/imports/api/collections/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';

class CommunityDirectory extends React.Component {
	render() {
		return (
			<div className="CommunityDirectory">
				<h3>Community Directory</h3>
				<CommunityMemberList />
			</div>
		);
	}
}


export default CommunityDirectory;
