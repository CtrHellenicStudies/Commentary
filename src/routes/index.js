import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// lib
import Utils from './lib/utils';
import { login } from './lib/auth'

// graphql
import { tenantsBySubdomainQuery } from './graphql/methods/tenants'

// layouts
import CommentaryLayout from './modules/comments/layouts/CommentaryLayout';
import AddCommentLayout from './modules/comments/layouts/AddCommentLayout';
import AddKeywordLayout from './modules/keywords/layouts/AddKeywordLayout/AddKeywordLayout';
import AddRevisionLayout from './modules/revisions/layouts/AddRevisionLayout/AddRevisionLayout';
import EditKeywordLayout from './modules/keywords/layouts/EditKeywordsLayout/EditKeywordLayout';
import TextNodesEditorLayout from './modules/textNodes/layouts/TextNodesLayout/TextNodesEditorLayout';
import HomeLayout from './modules/home/layouts/HomeLayouts/HomeLayout';
import NameResolutionServiceLayout from './modules/services/layouts/NameResolutionServiceLayout/NameResolutionServiceLayout';
import NotFound from './modules/notFound/components/NotFound/NotFound';

// pages
import Page from './modules/page/components/Page/Page';
import CommentersPage from './modules/commenters/components/CommenterPage/CommentersPage';
import CommenterDetail from './modules/commenters/components/CommenterDetail/CommenterDetail';
import KeywordsPage from './modules/keywords/components/KeywordsPage/KeywordsPage';
import KeywordDetail from './modules/keywords/components/KeywordDetail/KeywordDetail';
import ProfilePage from './modules/profile/components/ProfilePage/ProfilePage';
import ReferenceWorksPage from './modules/referenceWorks/components/ReferenceWorksPage/ReferenceWorksPage';
import ReferenceWorkDetail from './modules/referenceWorks/components/ReferenceWorkDetail/ReferenceWorkDetail';

// modules
import settingsRoutes from './modules/settings/routes';
import authenticationRoutes from './modules/auth/routes';

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
			{commentaryRoutes}

			{/** Tags routes */}
			{tagRoutes}

			{/** Reference works routes */}
			{referenceWorkRoutes}

			{/** Commenters routes */}
			{commentersRoutes}

			{/** TextNode routes */}
			{textNodeRoutes}

			{/** Users routes */}
			{userRoutes}

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

export default Routes;
