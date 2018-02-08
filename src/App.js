import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// lib
import Utils from './lib/utils';
import { login, logoutUser } from './lib/auth'

// graphql
import { tenantsBySubdomainQuery } from './graphql/methods/tenants'

// layouts
import CommentaryLayout from './modules/comments/layouts/CommentaryLayout';
import AddCommentLayout from './modules/comments/layouts/AddCommentLayout';
import AddKeywordLayout from './modules/keywords/layouts/AddKeywordLayout/AddKeywordLayout';
import AddTranslationLayout from './modules/translations/addTranslation/AddTranslationLayout';
import AddRevisionLayout from './modules/revisions/layouts/AddRevisionLayout/AddRevisionLayout';
import EditKeywordLayout from './modules/keywords/layouts/EditKeywordsLayout/EditKeywordLayout';
import TextNodesEditorLayout from './modules/textNodes/TextNodesEditorLayout';
import HomeLayout from './modules/home/layouts/HomeLayouts/HomeLayout';
import NameResolutionServiceLayout from './modules/services/NameResolutionServiceLayout';
import NotFound from './modules/notFound/components/NotFound/NotFound';

// pages
import Page from './modules/page/components/Page/Page';
import CommentersPage from './modules/commenters/components/CommenterPage/CommentersPage';
import CommenterDetail from './modules/commenters/components/CommenterDetail/CommenterDetail';
import KeywordsPage from './modules/keywords/components/KeywordsPage/KeywordsPage';
import KeywordDetail from './modules/keywords/components/KeywordDetail/KeywordDetail';
import ProfilePage from './modules/profile/ProfilePage';
import ReferenceWorksPage from './modules/referenceWorks/ReferenceWorksPage';
import ReferenceWorkDetail from './modules/referenceWorks/ReferenceWorkDetail';

// modules
import settingsRoutes from './modules/settings/routes';

// login with token
const cookies = new Cookies();
const token = cookies.get('token');
if (token) {
	login(token);
}

// set the base document meta for the application
Utils.setBaseDocMeta();

// parse tenant subdomain
const hostnameArray = document.location.hostname.split('.');
const tenantSubdomain =  hostnameArray.length > 2 ? hostnameArray[0] : undefined;

/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest} render={props => (
		cookies.get('token') ? (
			<Component {...props} />
		) : (
			<Redirect
				to={{
					pathname: '/login',
					state: { from: props.location }
				}}
			/>
		)
	)}
	/>
);

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
			<Route exact path="/" component={HomeLayout} />

			{/** Commentary routes */}
			<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
			<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
			<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />


			{/** Tags routes */}
			<PrivateRoute exact path="/tags/:slug/edit" component={EditKeywordLayout} />
			<PrivateRoute exact path="/tags/create" component={AddKeywordLayout} />
			<Route exact path="/tags/:slug" component={KeywordDetail} />
			<Route path="/words" render={() => <KeywordsPage type="word" title="Words" />} />
			<Route path="/ideas" render={() => <KeywordsPage type="idea" title="Ideas" />} />

			{/** Reference works routes */}
			<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
			<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />

			{/** Commenters routes */}
			<Route path="/commenters/:slug" render={params => <CommenterDetail {...params} defaultAvatarUrl="/images/default_user.jpg" />} />
			<Route exact path="/commentators" component={CommentersPage} />

			{/** Editor routes */}
			<PrivateRoute exact path="/translation/create" component={AddTranslationLayout} />
			<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
			<PrivateRoute exact path="/profile" component={ProfilePage} />

			{/** Users routes */}
			<Route
				path="/users/:userId" render={(params) => {
				if (props.userId) {
					return <Redirect to="/profile" />;
				}
					// return <PublicProfilePage userId={cookies.get('token')} />;
				}}
				/>

			{/** Auth routes */}
			<Route
				exact
				path="/sign-in"
				render={params => <HomeLayout {...params} signup />}
			/>
			<Route
				exact
				path="/sign-out"
				render={() => {
					try {
						logoutUser();
					} catch (err) {
						console.log(err);
					}
				}}
			/>
			<Route
				exact
				path="/forgot-password"
				render={params => <HomeLayout {...params} showForgotPwd />}
			/>


			{/** NRS routes */}
			<Route exact path="/v1/" component={NameResolutionServiceLayout} />
			<Route
				exact
				path="/v1/:urn/:commentId"
				render={params => (<NameResolutionServiceLayout
					version={1}
					urn={params.match.params.urn}
					commentId={params.match.params.commentId}
				/>)}
			/>
			<Route
				exact
				path="/v2/:urn/:commentId"
				render={params => (<NameResolutionServiceLayout
					version={2}
					urn={params.match.params.urn}
					commentId={params.match.params.commentId}
				/>)}
			/>
			<Route
				exact
				path="/v1/doi:doi"
				render={params => <NameResolutionServiceLayout version={1} doi={params.match.params.doi} />}
			/>

			{/** Basic page routes */}
			<Route
				path="/:slug"
				render={(params) => {
					const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
					if (reservedRoutes.indexOf(params.slug) === -1) {
						return <Page slug={params.match.params.slug} />;
					}
					return <Redirect to="/" />;
				}}
			/>

			{/** 404 routes */}
			<Route component={NotFound} />

			{/** Settings routes */}
			{settingsRoutes}
		</Switch>
	);
};

/**
 * Main application entry point
 */
const App = props => (
	<BrowserRouter>
		{routes(props)}
	</BrowserRouter>
);

PrivateRoute.propTypes = {
	component: PropTypes.func,
	location: PropTypes.string
};

routes.propTypes = {
	subdomain: PropTypes.string,
	tenantsBySubdomainQuery: PropTypes.object
};

const mapStateToProps = state => ({
	userId: state.auth.userId,
	username: state.auth.username,
	roles: state.auth.roles
});

export default compose(
	tenantsBySubdomainQuery,
	connect(mapStateToProps),
)(App);
