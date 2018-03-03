import React, { Component } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import Header from '../../components/navigation/Header';

// auth
import AuthModalContainer from '../../modules/auth/containers/AuthModalContainer';
import { login, register, logoutUser, verifyToken } from '../../lib/auth';

// lib
import muiTheme from '../../lib/muiTheme';
import Utils from '../../lib/utils';

class MainLayout extends Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<Header
						toggleSearchTerm={() => {}}
						handleChangeLineN={() => {}}
						filters={[]}
						selectedWork={{ slug: '' }}
					/>
					<main>
						<div className="commentary-comments">
							<div className="comment-group">
            		{this.props.children}
							</div>
						</div>
					</main>
					<AuthModalContainer
						loginMethod={login}
						signupMethod={register}
						logoutMethod={logoutUser}
						getUserFromServer={verifyToken}
					/>
				</div>
			</MuiThemeProvider>
		);
	}
}

MainLayout.propTypes = {
};

MainLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};



export default MainLayout;
