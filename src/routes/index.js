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
import {
  signInRoute, signOutRoute, updateForV2Route, forgotPasswordRoute,
} from '../modules/auth/routes';
import {
	addCommentRoute, addRevisionRoute, commentaryRoute,
} from '../modules/comments/routes';
import {
	commenterDetailRoute, commenterListRoute,
} from '../modules/commenters/routes';
import homeRoute from '../modules/home/routes';
import {
  editKeywordRoute, addKeywordRoute, keywordDetailRoute, wordsListRoute,
  ideasListRoute,
} from '../modules/keywords/routes';
import {
	nrsV1Route, nrsV1RouteWithURN, nrsV2Route, nrsV1DOI,
} from '../modules/nrs/routes';
import pageRoute from '../modules/page/routes';
import {
	referenceWorkDetailRoute, referenceWorkListRoute,
} from '../modules/referenceWorks/routes';
import textNodesRoute from '../modules/textNodes/routes';
import {
	profileRoute, publicProfileRoute,
} from '../modules/users/routes';
import {
	adminRoute, adminSettingsRoute,
} from '../modules/settings/routes';

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
			{homeRoute}

			{/** Commentary routes */}
			{addCommentRoute}
			{addRevisionRoute}
			{commentaryRoute}

			{/** Tags routes */}
		  {editKeywordRoute}
			{addKeywordRoute}
			{keywordDetailRoute}
			{wordsListRoute}
		  {ideasListRoute}

			{/** Reference works routes */}
			{referenceWorkDetailRoute}
			{referenceWorkListRoute}

			{/** Commenters routes */}
			{commenterDetailRoute}
			{commenterListRoute}

			{/** TextNode routes */}
			{textNodesRoute}

			{/** Users routes */}
			{profileRoute}
			{publicProfileRoute}

			{/** Auth routes */}
			{signInRoute}
			{signOutRoute}
			{updateForV2Route}
			{forgotPasswordRoute}

			{/** NRS routes */}
			{nrsV1Route}
			{nrsV1RouteWithURN}
			{nrsV2Route}
			{nrsV1DOI}

			{/** Settings routes */}
			{adminRoute}
			{adminSettingsRoute}

			{/** Basic page routes */}
			{pageRoute}

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
