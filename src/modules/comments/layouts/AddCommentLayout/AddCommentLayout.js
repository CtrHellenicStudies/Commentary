import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '../../../../lib/muiTheme';
import PageMeta from '../../../../lib/pageMeta';

// components
import AddCommentContainer from '../../containers/AddCommentContainer';
import SnackbarContainer from '../../../shared/containers/SnackbarContainer';


class AddCommentLayout extends React.Component {

	getChildrenContext() {
		return getMuiTheme(muiTheme);
	}

	render() {
		PageMeta.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={this.getChildrenContext()}>
				<div className="chs-layout chs-editor-layout add-comment-layout">
					<AddCommentContainer />
					<SnackbarContainer />
				</div>
			</MuiThemeProvider>
		);
	}
}

export default AddCommentLayout;
