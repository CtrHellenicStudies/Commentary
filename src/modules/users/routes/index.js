import React from 'react';
import { Route, Redirect } from 'react-router';

// Projects
import PrivateRoute from '../../../routes/PrivateRoute';
import ProfilePage from '../../profile/components/ProfilePage/ProfilePage';

/** Move this to a separate implementation than private route */
const profileRoute = (
	<PrivateRoute
		exact
		path="/profile"
		component={ProfilePage}
		roles={['any']}
	/>
);

const publicProfileRoute = (
	<Route
		path="/users/:userId" render={(props) => {
			if (props.userId) {
				return <Redirect to="/profile" />;
			}
			return null; // <PublicProfilePage userId={cookies.get('token')} />;
		}}
	/>
);

export {
	profileRoute, publicProfileRoute,
};
