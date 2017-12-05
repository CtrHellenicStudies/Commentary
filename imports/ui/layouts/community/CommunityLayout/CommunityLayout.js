import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';
import { compose } from 'react-apollo';

// layouts & components
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';
import { SnackAttack } from '/imports/ui/components/shared/SnackAttack';
import LoadingHome from '/imports/ui/components/loading/LoadingHome';
import CommunityPage from '/imports/ui/components/community/CommunityPage';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';

// models
import Settings from '/imports/models/settings';

// lib
import muiTheme from '/imports/lib/muiTheme';


const CommunityLayout = React.createClass({
	propTypes: {
		settings: PropTypes.object,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
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


const CommunityLayoutContainer = createContainer((props) => {
	const tenantId = sessionStorage.getItem('tenantId');

	return {
		settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === tenantId),
		ready: !props.settingsQuery.loading,
	};
}, CommunityLayout);

export default compose(settingsQuery)(CommunityLayoutContainer);
