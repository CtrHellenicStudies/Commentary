import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components:
import Header from '../../../../components/navigation/Header';
import TextNodesEditorContainer from '../../containers/TextNodesEditorContainer/TextNodesEditorContainer';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';

class TextNodesEditorLayout extends React.Component {
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
		if (!Utils.userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}

	render() {
		Utils.setTitle('Edit Source Text | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<Header
						toggleSearchTerm={() => {}}
						handleChangeLineN={() => {}}
						filters={[]}
						selectedWork={{ slug: 'tlg001' }}
					/>
					<main>
						<div className="commentary-comments">
							<div className="comment-group">
								<TextNodesEditorContainer />
							</div>
						</div>
					</main>
				</div>
			</MuiThemeProvider>
		);
	}
}

TextNodesEditorLayout.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};



export default TextNodesEditorLayout;
