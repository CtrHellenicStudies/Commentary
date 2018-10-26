import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// routes
import Routes from '../../routes';
import client from '../../middleware/apolloClient';

import { setUser } from '../../modules/auth/actions';
import { verifyToken } from '../../modules/auth/lib/auth';


class Root extends React.Component {

	componentDidMount() {
		this._initiateUser();
	}

	async _initiateUser() {
		const { dispatchSetUser } = this.props;

		try {
			const user = await verifyToken();

			if (user) {
				user.userId = user._id;
				user.roles = user.roles;
				user.commenters = user.canEditCommenters;
				dispatchSetUser(user);
			}
		} catch (err) {
			console.error(err);
		}
	}

	render() {

	 	const { store } = this.props;
		return (
			<ApolloProvider
				client={client}
				store={store}
			>
				<MuiThemeProvider>
					<div>
						<Routes />
					</div>
				</MuiThemeProvider>
			</ApolloProvider>
		);
	}
}

Root.propTypes = {
	store: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
	authMode: state.auth.authMode,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatchSetUser: async (userObject) => {
		await dispatch(setUser(userObject));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Root);
