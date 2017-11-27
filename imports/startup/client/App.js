import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import React from 'react';
import {Session} from 'meteor/session';
import Cookies from 'js-cookie';
import Utils from '/imports/lib/utils';
import { Meteor } from 'meteor/meteor';
import Tenants from '/imports/models/tenants';
import ApolloClient from 'apollo-client';

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
import UserLayout from '/imports/ui/layouts/user/UserLayout';
import NameResolutionServiceLayout from '/imports/ui/layouts/nameResolutionService/NameResolutionServiceLayout';
import NotFound from '/imports/ui/layouts/notFound/NotFound';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';

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
import ModalSignup from '../../ui/layouts/auth/ModalSignup/ModalSignup';

const networkInterface = createNetworkInterface({
	uri: Meteor.settings.public.graphql,
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

if (!Tenants.findOne()) {
	Meteor.subscribe('tenants');
}

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
const routes = (props) => {
	if (!Session.get('tenantId')) {
		const hostnameArray = document.location.hostname.split('.');
		let subdomain;

		if (hostnameArray.length > 2) {
			subdomain = hostnameArray[0];
		} else {
			subdomain = '';
			return <Route component={NotFound} />;
		}
		Meteor.call('findTenantBySubdomain', subdomain, (err, tenant) => {
			if (tenant) {
				Session.set('tenantId', tenant._id);
			} else {
				Session.set('noTenant', true);
			}
		});
	}
	if (Session.get('noTenant')) {
		return <Route component={NotFound} />;
	}
	return (
		<ApolloProvider client={client}>
			<Switch>
				<Route exact path="/" component={HomeLayout} />
				<Route
					exact path="/sign-in" render={(params) => <HomeLayout {...params} signup />}
				/>
				<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
				<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
				<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
				<Route exact path="/commenters" component={CommentersPage} />
				<PrivateRoute exact path="/tags/:slug/edit" component={EditKeywordLayout} />
				<PrivateRoute exact path="/tags/create" component={AddKeywordLayout} />
				<Route exact path="/tags/:slug" component={KeywordDetail} />
				<Route path="/words" render={() => <KeywordsPage type="word" title="Words" />} />
				<Route path="/ideas" render={() => <KeywordsPage type="idea" title="Ideas" />} />
				<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
				<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />
				<Route path="/commenters/:slug" render={(props) => <CommenterDetail {...props} defaultAvatarUrl="/images/default_user.jpg" />} />
				<Route exact path="/commenters" component={CommentersPage} />
				<PrivateRoute exact path="/translation/create" component={AddTranslationLayout} />
				<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
				<PrivateRoute exact path="/profile" component={ProfilePage} />
				<Route
					path="/users/:userId" render={(params) => {
						if (Meteor.userId() && Meteor.userId() === params.match.params.userId) {
							return <Redirect to="/profile" />;
						}
						return <PublicProfilePage userId={params.match.params.userId} />;
					}}
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
				<Route
					path="/:slug" render={(params) => {
						const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
						if (reservedRoutes.indexOf(params.slug) === -1) {
							return <Page slug={params.match.params.slug} />;
						}
						return <Redirect to="/" />;
					}}
				/>
				<Route component={NotFound} />
			</Switch>
		</ApolloProvider>
	);
};
const App = () => (
	<BrowserRouter>
		{routes()}
	</BrowserRouter>
);

export default App;
