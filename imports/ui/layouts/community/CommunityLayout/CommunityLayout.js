import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

// lib
import muiTheme from '/imports/lib/muiTheme';


class CommunityLayout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tenantId: sessionStorage.getItem('tenantId')
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === this.state.tenantId)
		});
	}
	render() {
		const { settings } = this.state;

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
	}

}
CommunityLayout.propTypes = {
	settingsQuery: PropTypes.object,
};

export default compose(settingsQuery)(CommunityLayout);
