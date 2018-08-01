import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// routes
import Routes from '../../routes';
import client from '../../middleware/apolloClient';


const Root = ({ store }) => (
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

Root.propTypes = {
	store: PropTypes.shape({}).isRequired,
};

export default Root;
