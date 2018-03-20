import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Projects
import MainLayout from '../../../layouts/MainLayout';
import ProfileContainer from '../containers/ProfileContainer';
import ProfileProjectsContainer from '../containers/ProfileProjectsContainer';

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
			path="/users/:userId" render={(params) => {
			if (props.userId) {
				return <Redirect to="/profile" />;
			}
				return // <PublicProfilePage userId={cookies.get('token')} />;
			}}
		/>
	</div>
);
