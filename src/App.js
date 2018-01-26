import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { compose } from 'react-apollo';

// lib
import Utils from './lib/utils';
import { login, logout } from './lib/auth'

// graphql
import { tenantsBySubdomainQuery } from './graphql/methods/tenants'
import { usersQuery } from './graphql/methods/users';

// layouts
import CommentaryLayout from './modules/comments/CommentaryLayout';
import AddCommentLayout from './modules/comments/addComment/AddCommentLayout';
import AddKeywordLayout from './modules/keywords/addKeyword/AddKeywordLayout';
import AddTranslationLayout from './modules/translations/addTranslation/AddTranslationLayout';
import AddRevisionLayout from './modules/revisions/addRevision/AddRevisionLayout';
import EditKeywordLayout from './modules/keywords/editKeyword/EditKeywordLayout';
import TextNodesEditorLayout from './modules/textNodes/TextNodesEditorLayout';
import HomeLayout from './modules/home/HomeLayout';
import NameResolutionServiceLayout from './modules/services/NameResolutionServiceLayout';
import NotFound from './modules/notFound/NotFound';

// pages
import Page from './modules/page/Page';
import CommentersPage from './modules/comenters/CommentersPage';
import CommenterDetail from './modules/comenters/CommenterDetail';
import KeywordsPage from './modules/keywords/KeywordsPage';
import KeywordDetail from './modules/keywords/KeywordDetail';
import ProfilePage from './modules/profile/ProfilePage';
import ReferenceWorksPage from './modules/referenceWorks/ReferenceWorksPage';
import ReferenceWorkDetail from './modules/referenceWorks/ReferenceWorkDetail';


const loginToken = Cookies.get('token');
if (loginToken) {
	login(loginToken);
}

Utils.setBaseDocMeta();

const hostnameArray = document.location.hostname.split('.');
const tenantSubdomain =  hostnameArray.length > 2 ? hostnameArray[0] : undefined;
/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest} render={props => (
		Cookies.get('token') ? (
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
function canGetUserDatas(user, query) {
	if(user && 
	!query.loading &&
	query.users.length && 
	!(query.users[0]._id === user._id)) {
		return true;
	}
	return false;
} 
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

	const user = !Cookies.get('user') ? undefined : JSON.parse(Cookies.get('user'));
	if (canGetUserDatas(user, props.usersQuery)) {
		const id = JSON.parse(user)._id;
		props.usersQuery.refetch({
			id: id,
		});
	} else if(user && !props.usersQuery.loading) {
		Cookies.set('user', props.usersQuery.users[0]);
		console.log(props.usersQuery.users[0]);
	}
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
			<Route exact path="/commenters" component={CommentersPage} />

			{/** Editor routes */}
			<PrivateRoute exact path="/translation/create" component={AddTranslationLayout} />
			<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
			<PrivateRoute exact path="/profile" component={ProfilePage} />

			{/** Users routes */}
			<Route
				path="/users/:userId" render={(params) => {
				if (Cookies.get('token')) {
					return <Redirect to="/profile" />;
				}
					// return <PublicProfilePage userId={Cookies.get('token')} />;
				}}
				/>

			{/** Auth routes */}
			<Route
				exact
				path="/sign-in"
				render={params => <HomeLayout {...params} signup />}
			/>
			<Route
				path="/sign-out"
				render={() => {
					try {
						logout();
					} catch (err) {
						console.log(err);
					} finally {
						console.log('error');
                      //  return (<Redirect to="/" />);
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
export default compose(tenantsBySubdomainQuery, usersQuery)(App);
