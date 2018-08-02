import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// layouts & components
import Header from '../../../../components/navigation/Header';
import Footer from '../../../../components/navigation/Footer';
import SnackbarContainer from '../../../shared/containers/SnackbarContainer';
import LoadingHome from '../../../../components/loading/LoadingHome';
import CommunityPage from '../../components/CommunityPage/CommunityPage';

// auth
import AuthModalContainer from '../../../../modules/auth/containers/AuthModalContainer';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';

// lib
import muiTheme from '../../../../lib/muiTheme';


class CommunityLayout extends React.Component {

	render() {
		const { tenantId } = this.props;
		const settings = this.props.settingsQuery.loading ? {} : this.props.settingsQuery.settings.find(x => x.tenantId === tenantId)

		if (!settings) {
			return <LoadingHome />;
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout community-layout">
					<Header />
					<CommunityPage />
					<Footer />
					<SnackbarContainer />
					<AuthModalContainer />
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
