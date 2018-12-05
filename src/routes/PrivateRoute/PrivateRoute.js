import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import _ from 'underscore';
import PropTypes from 'prop-types';


// instantiate cookies
const cookies = new Cookies();


/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ auth, roles, component: Component, ...rest }) => {

	/**
	// If user is not logged in, send them to sign in screen
	if (!cookies.get('token')) {
		return (
			<Redirect
				to={'/auth/sign-in'}
			/>
		);
	}

	// if user is logged in, prevent redirect from happening before roles are loaded
	if (!auth.userId) {
		return null;
	}

	// if user is logged in but unauthorized to access this route, send them to the
	// unauthorized route
	if (
		auth.roles
		&& !(_.intersection(roles, auth.roles).length)
	) {
		return (
			<Redirect
				to={'/unauthorized'}
			/>
		);
	}
	*/

	return (
		<Route
			{...rest}
			component={Component}
		/>
	);
}

PrivateRoute.propTypes = {
	auth: PropTypes.object,
	roles: PropTypes.array,
}


const mapStateToProps = (state, props) => ({
	leftMenuOpen: state.leftMenu.open,
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
