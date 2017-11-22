import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// models
import Settings from '/imports/models/settings';
import Tenant from '/imports/models/tenants';

// layouts
import Header from '/imports/ui/layouts/header/Header';
import Footer from '/imports/ui/components/footer/Footer';
import CommunityLayout from '/imports/ui/layouts/community/CommunityLayout';
import NameResolutionServiceLayout from '/imports/ui/layouts/nameResolutionService/NameResolutionServiceLayout';

// components
import Home from '/imports/ui/components/home/Home';
import LoadingHome from '/imports/ui/components/loading/LoadingHome';

// lib
import muiTheme from '/imports/lib/muiTheme';


class HomeLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
		};
	}

	componentDidMount() {
		if (typeof location.hash !== 'undefined' && location.hash.length > 0) {
			setTimeout(() => {
				$('html, body').animate({ scrollTop: $(location.hash).offset().top - 100 }, 300);
			}, 1000);
		}
	}

	render() {
		const { settings, tenant, ready } = this.props;
		if (!ready || !tenant) {
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
						tenantId={Session.get('tenantId')}
					/>

					<Footer />
				</div>
			</MuiThemeProvider>
		);
	}

}

HomeLayout.propTypes = {
	settings: PropTypes.object,
	ready: PropTypes.bool,
	tenant: PropTypes.object,
};

const HomeLayoutContainer = createContainer(() => {
	const handle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	return {
		settings: Settings.findOne(),
		tenant: Tenant.findOne({_id: Session.get('tenantId')}),
		ready: handle.ready(),
	};
}, HomeLayout);

export default HomeLayoutContainer;
