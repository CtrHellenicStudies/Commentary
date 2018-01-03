import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { compose } from 'react-apollo';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import { ApolloClient } from 'apollo-client';

// lib
import Utils from './modules/lib/utils';
import { login, logout } from './modules/auth/auth'

// graphql
import { tenantsBySubdomainQuery } from './modules/graphql/methods/tenants'

// layouts
import CommentaryLayout from './modules/components/comenters/CommentaryLayout';
import AddCommentLayout from './modules/components/comments/addComment/AddCommentLayout';
import AddKeywordLayout from './modules/components/keywords/addKeyword/AddKeywordLayout';
import AddTranslationLayout from './modules/components/translations/addTranslation/AddTranslationLayout';
import AddRevisionLayout from './modules/components/revisions/addRevision/AddRevisionLayout';
import EditKeywordLayout from './modules/components/keywords/editKeyword/EditKeywordLayout';
import TextNodesEditorLayout from './modules/components/textNodes/TextNodesEditorLayout';
import HomeLayout from './modules/components/home/HomeLayout';
import NameResolutionServiceLayout from './modules/components/services/NameResolutionServiceLayout';
import NotFound from './modules/components/notFound/NotFound';

// pages
import Page from './modules/components/page/Page';
import CommentersPage from './modules/components/comenters/CommentersPage';
import CommenterDetail from './modules/components/comenters/CommenterDetail';
import KeywordsPage from './modules/components/keywords/KeywordsPage';
import KeywordDetail from './modules/components/keywords/KeywordDetail';
import ProfilePage from './modules/components/profile/ProfilePage';
import ReferenceWorksPage from './modules/components/referenceWorks/ReferenceWorksPage';
import ReferenceWorkDetail from './modules/components/referenceWorks/ReferenceWorkDetail';


const loginToken = Cookies.get('token');
if (loginToken) {
	login(loginToken);
}

const uriAddress = process.env.graphql ? process.env.public.GRAPHQL : 'http://ahcip.orphe.us/graphql'; // TODO
console.log(uriAddress);

const networkInterface = createNetworkInterface({
	uri: uriAddress,
});

const client = new ApolloClient({
	networkInterface
});

networkInterface.use([{
	applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {};
		}
		const token = Cookies.get('loginToken');
		req.options.headers.authorization = token;
		next();
	}
}]);

// Get tenant subdomain
const hostnameArray = document.location.hostname.split('.');
let tenantSubdomain;
if (hostnameArray.length > 2) {
	tenantSubdomain = hostnameArray[0];
}
Utils.setBaseDocMeta();

/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (
Cookies.get('token') ? (
	<Component {...props} />
) : (
	<Redirect
		to={{
			pathname: '/login',
			state: { from: props.location },
		}}
	/>)
)}
	/>
);

/**
 * Application routes
 */
const routes = (props) => {
	if (!sessionStorage.getItem('tenantId')) {
		if (!props.subdomain) {
			return <Route component={NotFound} />;
		}

		if (
!props.tenantsBySubdomainQuery.loading
&& props.tenantsBySubdomainQuery.tenantBySubdomain
) {
			sessionStorage.setItem('tenantId', props.tenantsBySubdomainQuery.tenantBySubdomain._id);
		} else if (
!props.tenantsBySubdomainQuery.loading
&& !props.tenantsBySubdomainQuery.tenantBySubdomain
) {
			sessionStorage.setItem('noTenant', true);
		}
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
			{/* <Route
path="/users/:userId" render={(params) => {
if (Cookies.get('token')) {
return <Redirect to="/profile" />;
}
return <PublicProfilePage userId={Cookies.get('token')} />;
}}
/> */}

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
						logout(() => {
							const domain = Utils.getEnvDomain();
							Cookies.remove('userId', { domain });
							Cookies.remove('loginToken', { domain });
						});
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
	component: PropTypes.object,
	location: PropTypes.string
};
routes.propTypes = {
	subdomain: PropTypes.string,
	tenantsBySubdomainQuery: PropTypes.object
};
export default compose(tenantsBySubdomainQuery)(App);
