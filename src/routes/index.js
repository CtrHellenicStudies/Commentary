import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import React from 'react';
import { compose } from 'react-apollo';

// lib
import Utils from '../lib/utils';

// graphql
import tenantBySubdomainQuery from '../modules/tenants/graphql/queries/tenantBySubdomain'

// layouts
import NotFound from '../modules/notFound/components/NotFound/NotFound';

// modules
import {
	signInRoute, signOutRoute, updateForV2Route, forgotPasswordRoute,
	unauthorizedRoute,
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
	adminRoute,
} from '../modules/settings/routes';



/**
 * Application routes
 */
const routes = (props) => {

	// set the base document meta for the application
	Utils.setBaseDocMeta();

	if (
		props.tenantQuery
		&& !props.tenantQuery.loading
	) {
		if (!props.tenantQuery.tenantBySubdomain) {
			return <Route component={NotFound} />;
		}

		sessionStorage.setItem('tenantId', props.tenantQuery.tenantBySubdomain._id);
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
			{unauthorizedRoute}

			{/** NRS routes */}
			{nrsV1Route}
			{nrsV1RouteWithURN}
			{nrsV2Route}
			{nrsV1DOI}

			{/** Settings routes */}
			{adminRoute}

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

export default compose(tenantBySubdomainQuery)(Routes);
