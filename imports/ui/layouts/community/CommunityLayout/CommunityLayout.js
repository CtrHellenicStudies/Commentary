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
import CommunityPage from '/imports/ui/components/community/CommunityPage';

// api
import Settings from '/imports/api/collections/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';


const CommunityLayout = React.createClass({
	propTypes: {
		settings: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	render() {
		const { settings } = this.props;

		if (!settings) {
			return <LoadingHome />;
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout community-layout">
					<Header />
					<CommunityPage />
					<Footer />
					<SnackAttack />
				</div>
			</MuiThemeProvider>
		);
	},

});


const CommunityLayoutContainer = createContainer(() => {
	const handle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: Settings.findOne(),
		ready: handle.ready(),
	};
}, CommunityLayout);

export default CommunityLayoutContainer;
