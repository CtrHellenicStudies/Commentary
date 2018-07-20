import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';
import profileQuery from '../../graphql/queries/profile';

// components
import ProfilePage from '../../components/ProfilePage';
import LoadingPage from '../../../../components/loading/LoadingPage';


const ProfilePageContainer = props => {
	let settings;
	let user;

	console.log(props);

	if (props.settingsQuery.loading || props.userProfileQuery.loading) {
		return <LoadingPage />;
	}

	if (props.settingsQuery.settings) {
		settings = props.settingsQuery.settings.find(x => x.tenantId === props.tenantId);
	}

	if (props.userProfileQuery.userProfile) {
		user = props.userProfileQuery.userProfile;
	}

	if (!settings || !user) {
		return <div />
	}


	return (
		<ProfilePage
			settings={settings}
			user={user}
		/>
	);
};

ProfilePageContainer.propTypes = {
	settingsQuery: PropTypes.object,
	tenantId: PropTypes.string,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
	profileQuery,
)(ProfilePageContainer);
