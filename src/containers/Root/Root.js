import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router';
import { CookiesProvider } from 'react-cookie';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// routes
import Routes from '../../routes';
import client from '../../middleware/apolloClient';

// auth
import AuthModalContainer from '../../modules/auth/containers/AuthModalContainer';
import { login, register, logoutUser, verifyToken } from '../../lib/auth';


const scrollToElemOrTop = () => {
	if (window.location.hash.length) {
		const elemHash = window.location.hash.replace('#', '');

		if (elemHash) {
			const elem = document.getElementById(elemHash);

			if (elem) {
				elem.scrollIntoView();
			}
		}
	} else {
		window.scrollTo(0, 0);
	}
};

const Root = ({ store }) => (
	<ApolloProvider
		client={client}
		store={store}
	>
		<MuiThemeProvider>
      <div>
  			<Routes />
  			<AuthModalContainer
  				loginMethod={login}
  				signupMethod={register}
  				logoutMethod={logoutUser}
  				getUserFromServer={verifyToken}
  			/>
      </div>
		</MuiThemeProvider>
	</ApolloProvider>
);

Root.propTypes = {
	store: PropTypes.shape({}).isRequired,
};

export default Root;