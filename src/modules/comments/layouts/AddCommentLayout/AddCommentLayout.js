import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoBind from 'react-autobind';

// components:
import Spinner from '../../../../components/loading/Spinner';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';

// components
import AddCommentContainer from '../../containers/AddCommentContainer/AddCommentContainer';


class AddCommentLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: [],
			selectedLineFrom: 0,
			selectedLineTo: 0,
			contextReaderOpen: true,
			loading: false,
			selectedWork: '',
			textNodesUrn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-1.49',
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

	updatetextNodesUrn(urn) {
		this.setState({
			textNodesUrn: urn,
		});
	}

	render() {
		const { loading } = this.state;
		const textNodesUrn = this.state.textNodesUrn ? this.state.textNodesUrn : 'urn:cts:greekLit:tlg0012.tlg001';


		Utils.setTitle('Add Comment | The Center for Hellenic Studies Commentaries');

		return (
			<MuiThemeProvider muiTheme={this.getChildrenContext()}>
				{!loading ?
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<AddCommentContainer
							textNodesUrn={textNodesUrn}
							updatetextNodesUrn={this.updatetextNodesUrn.bind(this)}
						/>
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
