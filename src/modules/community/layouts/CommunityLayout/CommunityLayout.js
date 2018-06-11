import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts & components
import Header from '../../../../components/navigation/Header';
import Footer from '../../../../components/navigation/Footer';
import { SnackAttack } from '../../../shared/components/SnackAttack/SnackAttack';
import LoadingHome from '../../../../components/loading/LoadingHome';
import CommunityPage from '../../components/CommunityPage/CommunityPage';

// auth
import AuthModalContainer from '../../../../modules/auth/containers/AuthModalContainer';
import { login, register, logoutUser, verifyToken } from '../../../../lib/auth';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// lib
import muiTheme from '../../../../lib/muiTheme';


class CommunityLayout extends Component {

	componentWillReceiveProps(nextProps) {
		const { tenantId } = this.props;

		this.setState({
			settings: nextProps.settingsQuery.loading ? {} : nextProps.settingsQuery.settings.find(x => x.tenantId === tenantId)
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

CommunityLayout.propTypes = {
	settingsQuery: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	settingsQuery,
	connect(mapStateToProps),
)(CommunityLayout);
