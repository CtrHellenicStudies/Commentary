import React from 'react';
import { Route, Redirect } from 'react-router';

// Projects
import PrivateRoute from '../../../routes/PrivateRoute';
import MainLayout from '../../../layouts/MainLayout';
import ProfilePage from '../../profile/components/ProfilePage/ProfilePage';

export default (
	<div>
		{/*}
		<Route path="/profile" component={MainLayout}>
			<IndexRoute component={ProfileContainer} />
			<Route path="/profile/projects" component={ProfileProjectsContainer} />
		</Route>
		*/}
		<PrivateRoute exact path="/profile" component={ProfilePage} />
		<Route
			path="/users/:userId" render={(props) => {
			if (props.userId) {
				return <Redirect to="/profile" />;
			}
				return null; // <PublicProfilePage userId={cookies.get('token')} />;
			}}
		/>
	</div>
);
