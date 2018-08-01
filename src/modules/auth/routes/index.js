import React from 'react';
import { Route } from 'react-router';
import { logoutUser } from '../../../lib/auth'

// layout
import MainLayout from '../../../layouts/MainLayout';

// component
import Unauthorized from '../components/Unauthorized';
import AuthContainer from '../containers/AuthContainer';
import ForgotPwdFormContainer from '../containers/ForgotPwdFormContainer';
import UpdateV2FormContainer from '../containers/UpdateV2FormContainer';


const authRoutes = (
	<MainLayout>
		<Route
			path="/auth/sign-in"
			component={AuthContainer}
		/>
		<Route
			path="/auth/update-for-v2"
			component={UpdateV2FormContainer}
		/>
		<Route
			path="/auth/forgot-password"
			component={ForgotPwdFormContainer}
		/>
	</MainLayout>
);

const signOutRoute = (
	<Route
		exact
		path="/sign-out"
		render={() => {
			try {
				logoutUser();
			} catch (err) {
				console.log(err);
			}
		}}
	/>
);


const unauthorizedRoute = (
	<Route
		exact
		path="/unauthorized"
		component={Unauthorized}
	/>
);

export {
	authRoutes, signOutRoute, unauthorizedRoute,
};
