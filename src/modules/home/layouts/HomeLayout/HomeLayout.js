import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '../../../../lib/muiTheme';

// graphql
import tenantsQuery from '../../../tenants/graphql/queries/tenants';
import settingsQuery from '../../../settings/graphql/queries/list';

// layouts
import Header from '../../../../components/navigation/Header';
import Footer from '../../../../components/navigation/Footer';
import CommunityLayout from '../../../community/layouts/CommunityLayout/CommunityLayout';
import NameResolutionServiceLayout from '../../../nrs/layouts/NameResolutionServiceLayout';

// components
import HomeContainer from '../../containers/HomeContainer';
import LoadingHome from '../../../../components/loading/LoadingHome';

// auth
import AuthModalContainer from '../../../../modules/auth/containers/AuthModalContainer';


class HomeLayout extends React.Component {

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

	render() {
		let tenant = null;
		const { tenantId, tenantsQuery } = this.props;


		if (
			tenantsQuery
			&& tenantsQuery.tenants
		) {
			tenant = tenantsQuery.tenants.find(x => x._id === tenantId);
		}

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

					<HomeContainer
						history={this.props.history}
					/>

					<Footer />
					<AuthModalContainer />
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

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
	tenantsQuery,
)(HomeLayout);
