import React from 'react';
import { Route, Switch } from 'react-router';
import { logoutUser } from '../../../lib/auth'

// layout
import AuthLayout from '../layouts/AuthLayout';


const signInRoute = (
  <Route
  	exact
  	path="/sign-in"
  	component={AuthLayout}
  />
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

const updateForV2Route = (
	<Route
		exact
		path="/update-for-v2"
		component={() => (
      <AuthLayout
        updateV2
      />
    )}
	/>
);

// TODO: redo with own component instead of modal
const forgotPasswordRoute = (
	<Route
		exact
		path="/forgot-password"
		render={params => <AuthLayout {...params} showForgotPwd />}
	/>
);

export {
  signInRoute, signOutRoute, updateForV2Route, forgotPasswordRoute,
};
