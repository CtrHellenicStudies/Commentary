import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import Header from '../../../../components/navigation/Header';
import TextNodesEditorContainer from '../../containers/TextNodesEditorContainer/TextNodesEditorContainer';

// lib
import muiTheme from '../../../../lib/muiTheme';
import PageMeta from '../../../../lib/pageMeta';
import userInRole from '../../../../lib/userInRole';


class TextNodesEditorLayout extends React.Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	componentWillUpdate() {
		this.handlePermissions();
	}

	componentWillUnmount() {
		if (this.timeout) clearTimeout(this.timeout);
	}

	handlePermissions() {
		if (!userInRole(Cookies.get('user'), ['editor', 'admin', 'commenter'])) {
			this.props.history.push('/');
		}
	}

	render() {
		PageMeta.setTitle('Edit Source Text | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<Header />
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
