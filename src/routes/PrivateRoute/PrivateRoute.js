import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ roles, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (
			cookies.get('token') ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/sign-in',
					}}
				/>
			)
		)}
	/>
);


const mapStateToProps = (state, props) => ({
	leftMenuOpen: state.leftMenu.open,
	userId: state.auth.userId,
	roles: state.auth.roles,
	commenters: state.auth.commenters
});

export default connect(mapStateToProps)(PrivateRoute);
