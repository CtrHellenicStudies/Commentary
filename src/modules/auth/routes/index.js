import React from 'react';
import { Route } from 'react-router';
import { logoutUser } from '../../../lib/auth'

// layout
import AuthLayout from '../layouts/AuthLayout';


export default (
  <Route>
    <div>
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
      {/*
			<Route
				exact
				path="/forgot-password"
				render={params => <HomeLayout {...params} showForgotPwd />}
			/>
      */}
    </div>
  </Route>
);
