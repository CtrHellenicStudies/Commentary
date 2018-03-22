import React from 'react';
import { Route, Switch } from 'react-router';
import { logoutUser } from '../../../lib/auth'

// layout
import AuthLayout from '../layouts/AuthLayout';


export default (
  <Switch>
		<Route
			exact
			path="/sign-in"
			component={AuthLayout}
		/>
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
		<Route
			exact
			path="/update-for-v2"
			component={() => (
        <AuthLayout
          updateV2
        />
      )}
		/>
    {/*
		<Route
			exact
			path="/forgot-password"
			render={params => <HomeLayout {...params} showForgotPwd />}
		/>
    */}
  </Switch>
);
