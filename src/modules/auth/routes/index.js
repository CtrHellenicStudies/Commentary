import React from 'react';
import { Route } from 'react-router';

// layout
import MainLayout from '../../../layouts/MainLayout';

// component
import Unauthorized from '../components/Unauthorized';
import AuthContainer from '../containers/AuthContainer';
import ForgotPwdForm from '../components/ForgotPwdForm';
import ResetPasswordForm from '../components/ResetPasswordForm';
import UpdateForV2Message from '../components/UpdateForV2Message';
import Logout from '../components/Logout';


const authRoutes = (
	<MainLayout>
		<Route
			path="/auth/sign-in"
			component={AuthContainer}
		/>
		<Route
			path="/auth/reset-password"
			component={ResetPasswordForm}
		/>
		<Route
			path="/auth/update-for-v2"
			component={UpdateForV2Message}
		/>
		<Route
			path="/auth/forgot-password"
			component={ForgotPwdForm}
		/>
		<Route
			path="/auth/sign-out"
			component={Logout}
		/>
	</MainLayout>
);


const unauthorizedRoute = (
	<Route
		exact
		path="/unauthorized"
		component={Unauthorized}
	/>
);

export {
	authRoutes, unauthorizedRoute,
};
