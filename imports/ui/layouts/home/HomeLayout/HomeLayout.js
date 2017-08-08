import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Settings from '/imports/api/collections/settings';
import Tenant from '/imports/api/collections/tenants';

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
		const { settings, tenant } = this.props;

		if (!settings || !tenant) {
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
					/>

					<Home
						settings={settings}
					/>

					<Footer />
				</div>
			</MuiThemeProvider>
		);
	}

}

HomeLayout.propTypes = {
	settings: React.PropTypes.object,
	ready: React.PropTypes.bool,
	tenant: React.PropTypes.object,
};

const HomeLayoutContainer = createContainer(() => {
	const handle = Meteor.subscribe('settings.tenant', Session.get('tenantId'));

	return {
		settings: Settings.findOne(),
		ready: handle.ready(),
		tenant: Tenant.findOne({_id: Session.get('tenantId')}),
	};
}, HomeLayout);

export default HomeLayoutContainer;
