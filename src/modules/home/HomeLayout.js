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
import Header from '../../components/navigation/Header';
import Footer from '../../components/navigation/Footer';
import CommunityLayout from '../community/layouts/CommunityLayout/CommunityLayout';
import NameResolutionServiceLayout from '../services/NameResolutionServiceLayout';

// components
import Home from './Home';
import LoadingHome from '../../components/loading/LoadingHome';

// auth
import AuthModalContainer from '../../modules/auth/containers/AuthModalContainer';
import { login, register, logoutUser, verifyToken } from '../../lib/auth';


class HomeLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			settings: [],
			tenant: undefined
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
	componentWillReceiveProps(props) {
		if(this.props.settingsQuery.loading || this.props.tenantsQuery.loading) {
			return;
		}
		const tenantId = sessionStorage.getItem('tenantId');
		const settings = this.props.settingsQuery.settings.find(x => x.tenantId === tenantId);
		const tenant = this.props.tenantsQuery.tenants.find(x => x._id === tenantId);
		this.setState({
			settings: settings,
			tenant: tenant
		});

	}

	render() {
		const { tenant, settings } = this.state;
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
					<AuthModalContainer
						loginMethod={login}
						signupMethod={register}
						logoutMethod={logoutUser}
						getUserFromServer={verifyToken}
					/>
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
