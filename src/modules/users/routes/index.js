import React from 'react';
import { Route } from 'react-router';

// Projects
import ProfilePageContainer from '../containers/ProfilePageContainer';


/** Move this to a separate implementation than private route */
const profileRoute = (
	<Route
		exact
		path="/profile"
		component={ProfilePageContainer}
		roles={['any']}
	/>
);

/** TODO: restore the public profile page
const publicProfileRoute = (
	<Route
		path="/users/:userId"
		component={PublicProfilePage}
	/>
);
*/

export {
	profileRoute, // publicProfileRoute,
};
