import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';

// components:
import Spinner from '../../../../components/loading/Spinner';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';

// components
import AddCommentContainer from '../../containers/AddCommentContainer';


class AddCommentLayout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: '',
		};

		autoBind(this);
	}

	closeContextReader() {
		this.setState({
			contextReaderOpen: false,
		});
	}

	openContextReader() {
		this.setState({
			contextReaderOpen: true,
		});
	}

	getChildrenContext() {
		return getMuiTheme(muiTheme);
	}

	render() {
		const { loading } = this.state;


		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={this.getChildrenContext()}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<AddCommentContainer />
					</div>
					:
					<Spinner
						fullPage
					/>
				}
			</MuiThemeProvider>
		);
	}
}

export default AddCommentLayout;
