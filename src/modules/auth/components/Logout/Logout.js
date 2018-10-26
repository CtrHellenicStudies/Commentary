import React from 'react';
import { withRouter, Redirect } from 'react-router';

// lib
import { logoutUser } from '../../lib/auth'

class Logout extends React.Component {

	componentDidMount() {
		logoutUser();
	}

	render() {
		return (
			<div />
		);

		/*
		return (
			<Redirect
				to="/"
			/>
		);
		*/
	}
}

export default Logout;
