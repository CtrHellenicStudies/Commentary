import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// lib
import Utils from '../lib/utils';
import { login } from '../lib/auth'

// graphql
import { tenantsBySubdomainQuery } from '../graphql/methods/tenants'

// layouts
import NotFound from '../modules/notFound/components/NotFound/NotFound';

// modules
import authenticationRoutes from '../modules/auth/routes';
import commentersRoutes from '../modules/commenters/routes';
import commentsRoutes from '../modules/comments/routes';
import homeRoutes from '../modules/home/routes';
import keywordsRoutes from '../modules/keywords/routes';
import nrsRoutes from '../modules/nrs/routes';
import pageRoutes from '../modules/page/routes';
import referenceWorksRoutes from '../modules/referenceWorks/routes';
import textNodesRoutes from '../modules/textNodes/routes';
import usersRoutes from '../modules/users/routes';
import settingsRoutes from '../modules/settings/routes';

// instantiate cookies
const cookies = new Cookies();


/**
 * Application routes
 */
function setTenantInSession (query) {
	if (!query.loading
		&& query.tenantBySubdomain) {
		sessionStorage.setItem('tenantId', query.tenantBySubdomain._id);
	} else if (!query.loading
		&& !query.tenantBySubdomain) {
		sessionStorage.setItem('noTenant', true);
	}
}

const routes = (props) => {

  // set the base document meta for the application
  Utils.setBaseDocMeta();

  // parse tenant subdomain
  const hostnameArray = document.location.hostname.split('.');
  const tenantSubdomain =  hostnameArray.length > 2 ? hostnameArray[0] : undefined;

	if (!sessionStorage.getItem('tenantId')) {
		if (!tenantSubdomain) {
			return <Route component={NotFound} />;
		} else {
			sessionStorage.removeItem('noTenant');
			if (!props.tenantsBySubdomainQuery.tenantBySubdomain) {
				props.tenantsBySubdomainQuery.refetch({
					subdomain: tenantSubdomain
				});
			}
		}
		setTenantInSession(props.tenantsBySubdomainQuery);
	}

	if (sessionStorage.getItem('noTenant')) {
		return <Route component={NotFound} />;
	}

	return (
		<Switch>
			{/** Home routes */}
			{homeRoutes}

			{/** Commentary routes */}
			{commentsRoutes}

			{/** Tags routes */}
			{keywordsRoutes}

			{/** Reference works routes */}
			{referenceWorksRoutes}

			{/** Commenters routes */}
			{commentersRoutes}

			{/** TextNode routes */}
			{textNodesRoutes}

			{/** Users routes */}
			{usersRoutes}

			{/** Auth routes */}
			{authenticationRoutes}

			{/** NRS routes */}
			{nrsRoutes}

			{/** Settings routes */}
			{settingsRoutes}

			{/** Basic page routes */}
			{pageRoutes}

			{/** 404 routes */}
			<Route component={NotFound} />
		</Switch>
	);
};

/**
 * Main application entry point
 */
const Routes = props => (
	<BrowserRouter>
		{routes(props)}
	</BrowserRouter>
);

export default compose(tenantsBySubdomainQuery)(Routes);
