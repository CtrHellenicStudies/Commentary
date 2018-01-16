import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from '../../lib/muiTheme';

// graphql
import { tenantsQuery } from '../../graphql/methods/tenants';
import { settingsQuery } from '../../graphql/methods/settings';

// layouts
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import CommunityLayout from '../community/CommunityLayout';
import NameResolutionServiceLayout from '../services/NameResolutionServiceLayout';

// components
import Home from './Home';
import LoadingHome from '../../components/loading/LoadingHome';


class HomeLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
		};
	}

	componentDidMount() {
		if (typeof window.location.hash !== 'undefined' && window.location.hash.length > 0) {
			setTimeout(() => {
				if ($(window.location.hash).offset()) {
					$('html, body').animate({ scrollTop: $(window.location.hash).offset().top - 100 }, 300);
				}
			}, 1000);
		}
	}

	render() {

		const tenantId = sessionStorage.getItem('tenantId');
		const settings = this.props.settingsQuery.loading ? undefined : this.props.settingsQuery.settings.find(x => x.tenantId === tenantId);
		const tenant = this.props.tenantsQuery.loading ? undefined : this.props.tenantsQuery.tenants.find(x => x._id === tenantId);
		
		if (!tenant) {
			return <LoadingHome />;
		}

		if (
				tenant.subdomain === 'nrs'
			|| tenant.subdomain === 'nrs2'
		) {
			return <NameResolutionServiceLayout />;
		}

		if (tenant.isAnnotation) {
			return <CommunityLayout />;
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout home-layout">
					<Header
						isOnHomeView
						showSignup={this.props.signup}
						showForgotPwd={this.props.showForgotPwd}
						history={this.props.history}
					/>

					<Home
						settings={settings}
						history={this.props.history}
					/>

					<Footer />
				</div>
			</MuiThemeProvider>
		);
	}

}

HomeLayout.propTypes = {
	signup: PropTypes.func,
	showForgotPwd: PropTypes.func,
	history: PropTypes.any
};

export default compose(tenantsQuery, settingsQuery)(HomeLayout);
