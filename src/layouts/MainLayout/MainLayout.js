import React, { Component } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components:
import Header from '../../components/header/Header';

// lib
import muiTheme from '../../lib/muiTheme';
import Utils from '../../lib/utils';

class MainLayout extends Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	componentWillUpdate() {
		this.handlePermissions();
	}
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	}
	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		this.timeout = setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}

	// --- BEGNI PERMISSIONS HANDLE --- //
	handlePermissions() {
		if (!Utils.userInRole(Cookies.get('user')._id, ['editor', 'admin', 'commenter'])) {
			// this.props.history.push('/');
		}
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
