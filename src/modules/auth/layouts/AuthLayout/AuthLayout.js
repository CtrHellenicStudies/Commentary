import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import Header from '../../../../components/navigation/Header';

// auth
import AuthContainer from '../../containers/AuthContainer';
import { login, register, logoutUser, verifyToken } from '../../../../lib/auth';

// lib
import muiTheme from '../../../../lib/muiTheme';
import { userIsLoggedIn } from '../../../../lib/auth';


import './AuthLayout.css';


class AuthLayout extends Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	render() {
		if (userIsLoggedIn()) {
			this.props.history.push('/');
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout auth-layout">
					<Header
						toggleSearchTerm={() => {}}
						handleChangeLineN={() => {}}
						filters={[]}
						selectedWork={{ slug: '' }}
					/>
					<main>
  					<AuthContainer
  						loginMethod={login}
  						signupMethod={register}
  						logoutMethod={logoutUser}
  						getUserFromServer={verifyToken}
  					/>
					</main>
				</div>
			</MuiThemeProvider>
		);
	}
}

AuthLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};


export default withRouter(AuthLayout);