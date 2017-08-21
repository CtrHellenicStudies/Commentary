import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router';
// import Routes from '../components/routes';
import client from '../middleware/apolloClient';

// auth
// import AuthModal from '../modules/auth';
// import { login, verifyToken } from '../lib/auth';

const Root = ({store, history}) => (
	<ApolloProvider
		client={client}
		store={store}
	>
		<div>
			<Router history={history} routes={Routes} />
			<AuthModal
				loginMethod={login}
				getUserFromServer={verifyToken}
			/>
		</div>
	</ApolloProvider>
);

Root.propTypes = {
	store: PropTypes.shape({/* TODO: update */}).isRequired,
	history: PropTypes.shape({/* TODO: update */}).isRequired,
};

export default Root;
