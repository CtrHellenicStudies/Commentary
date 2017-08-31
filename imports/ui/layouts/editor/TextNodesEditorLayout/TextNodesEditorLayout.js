import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import { ApolloProvider } from 'react-apollo';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createBrowserHistory } from 'history';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Cookies from 'js-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components:
import Header from '/imports/ui/layouts/header/Header';
import FilterWidget from '/imports/ui/components/commentary/FilterWidget';
import Spinner from '/imports/ui/components/loading/Spinner';
import CommentLemmaSelect from '/imports/ui/components/editor/addComment/CommentLemmaSelect';
import AddKeyword from '/imports/ui/components/editor/keywords/AddKeyword';
import ContextPanel from '/imports/ui/layouts/commentary/ContextPanel';
import TextNodesEditor from '/imports/ui/components/editor/textNodes/TextNodesEditor';

// lib
import muiTheme from '/imports/lib/muiTheme';
import client from '/imports/middleware/apolloClient';
import configureStore from '/imports/store/configureStore';

// redux integration for layout
const store = configureStore();
const history = syncHistoryWithStore(createBrowserHistory(), store);


class TextNodesEditorLayout extends React.Component {
	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	componentWillUpdate() {
		this.handlePermissions();
	}

	showSnackBar(error) {
		this.setState({
			snackbarOpen: error.errors,
			snackbarMessage: error.errorMessage,
		});
		setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}

	// --- BEGNI PERMISSIONS HANDLE --- //
	handlePermissions() {
		if (Roles.subscription.ready()) {
			if (!Roles.userIsInRole(Meteor.userId(), ['editor', 'admin', 'commenter'])) {
				FlowRouter.go('/');
			}
		}
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
				<ApolloProvider
					client={client}
					store={store}
				>
					<div className="chs-layout chs-editor-layout add-comment-layout">
						<Header
							toggleSearchTerm={() => {}}
							handleChangeLineN={() => {}}
							filters={[]}
							selectedWork={{ slug: 'iliad' }}
						/>
						<main>
							<div className="commentary-comments">
								<div className="comment-group">
									<TextNodesEditor />
								</div>
							</div>
						</main>
					</div>
				</ApolloProvider>
			</MuiThemeProvider>
		);
	}
}

TextNodesEditorLayout.propTypes = {
	ready: React.PropTypes.bool,
	isTest: React.PropTypes.bool,
};

TextNodesEditorLayout.childContextTypes = {
	muiTheme: React.PropTypes.object.isRequired,
};


const TextNodesEditorLayoutContainer = (() => {
	const ready = Roles.subscription.ready();
	return {
		ready,
	};
}, TextNodesEditorLayout);


export default TextNodesEditorLayoutContainer;
