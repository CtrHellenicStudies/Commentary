import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import { Session } from 'meteor/session';
import Cookies from 'js-cookie';
import { Meteor } from 'meteor/meteor';
import { ApolloProvider, createNetworkInterface, compose } from 'react-apollo';

// lib
import Utils from '/imports/lib/utils';

// graphql
import { tenantsBySubdomainQuery } from '/imports/graphql/methods/tenants';

// layouts
import CommentaryLayout from '/imports/ui/layouts/commentary/CommentaryLayout';
import AddCommentLayout from '/imports/ui/layouts/editor/AddCommentLayout';
import AddKeywordLayout from '/imports/ui/layouts/editor/AddKeywordLayout';
import AddTranslationLayout from '/imports/ui/layouts/editor/AddTranslationLayout';
import AddRevisionLayout from '/imports/ui/layouts/editor/AddRevisionLayout';
import EditKeywordLayout from '/imports/ui/layouts/editor/EditKeywordLayout';
import TextNodesEditorLayout from '/imports/ui/layouts/editor/TextNodesEditorLayout';
import HomeLayout from '/imports/ui/layouts/home/HomeLayout';
import MasterLayout from '/imports/ui/layouts/master/MasterLayout';
import NameResolutionServiceLayout from '/imports/ui/layouts/nameResolutionService/NameResolutionServiceLayout';
import NotFound from '/imports/ui/layouts/notFound/NotFound';

// pages
import Page from '/imports/ui/components/pages/Page';
import CommentersPage from '/imports/ui/components/commenters/CommentersPage';
import CommenterDetail from '/imports/ui/components/commenters/CommenterDetail';
import KeywordsPage from '/imports/ui/components/keywords/KeywordsPage';
import KeywordDetail from '/imports/ui/components/keywords/KeywordDetail';
import ProfilePage from '/imports/ui/components/user/ProfilePage';
import PublicProfilePage from '/imports/ui/components/user/PublicProfilePage';
import ReferenceWorksPage from '/imports/ui/components/referenceWorks/ReferenceWorksPage';
import ReferenceWorkDetail from '/imports/ui/components/referenceWorks/ReferenceWorkDetail';
import ModalSignup from '/imports/ui/layouts/auth/ModalSignup/ModalSignup';


if (Meteor.userId()) {
	Meteor.subscribe('users.id', Meteor.userId());
	if (!Cookies.get('loginToken')) {
		Meteor.call('getNewStampedToken', (_err, token) => {

			if (_err) {
				console.error(_err);
				return false;
			}

			const domain = Utils.getEnvDomain();

			if (domain) {
				Cookies.set('userId', Meteor.userId(), { domain });
				Cookies.set('loginToken', token, { domain });
			} else {
				Cookies.set('userId', Meteor.userId());
				Cookies.set('loginToken', token);
			}
		});
	}
} else {
	const loginToken = Cookies.get('loginToken');
	if (loginToken) {
		Meteor.loginWithToken(loginToken);
	}
}

if (Meteor.isClient) {
	Utils.setBaseDocMeta();
}

/**
 * Private route
 * create a route restricted to a logged in user
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest} render={props => (
		Meteor.userId() ? (
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
			<Route path="/commenters/:slug" render={(props) => <CommenterDetail {...props} defaultAvatarUrl="/images/default_user.jpg" />} />
			<Route exact path="/commenters" component={CommentersPage} />

			{/** Editor routes */}
			<PrivateRoute exact path="/translation/create" component={AddTranslationLayout} />
			<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
			<PrivateRoute exact path="/profile" component={ProfilePage} />

			{/** Users routes */}
			<Route
				path="/users/:userId" render={(params) => {
					if (Meteor.userId() && Meteor.userId() === params.match.params.userId) {
						return <Redirect to="/profile" />;
					}
					return <PublicProfilePage userId={params.match.params.userId} />;
				}}
			/>

			{/** Auth routes */}
			<Route
				exact path="/sign-in" render={(params) => <HomeLayout {...params} signup />}
			/>
			<Route
				path="/sign-out" render={() => {
					try {
						Meteor.logout(() => {
							const domain = Utils.getEnvDomain();
							Cookies.remove('userId', {domain});
							Cookies.remove('loginToken', {domain});
						});
					} catch (err) {
						console.log(err);
					} finally {
						return (<Redirect to="/" />);
					}
				}}
			/>
			<Route
				exact path="/forgot-password" render={(params) => <HomeLayout {...params} showForgotPwd />}
			/>


			{/** NRS routes */}
			<Route exact path="/v1/" component={NameResolutionServiceLayout} />
			<Route
				exact path="/v1/:urn/:commentId" render={(params) => <NameResolutionServiceLayout version={1} urn={params.match.params.urn} commentId={params.match.params.commentId} />}
			/>
			<Route
				exact path="/v2/:urn/:commentId" render={(params) => <NameResolutionServiceLayout version={2} urn={params.match.params.urn} commentId={params.match.params.commentId} />}
			/>
			<Route
				exact path="/v1/doi:doi" render={(params) => <NameResolutionServiceLayout version={1} doi={params.match.params.doi} />}
			/>

			{/** Basic page routes */}
			<Route
				path="/:slug" render={(params) => {
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
const App = (props) => (
	<BrowserRouter>
		{routes(props)}
	</BrowserRouter>
);

export default compose(tenantsBySubdomainQuery)(App);
