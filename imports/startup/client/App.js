import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import React from 'react';
import {Session} from 'meteor/session';
import Cookies from 'js-cookie';

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

if (!Session.get('tenantId')) {
	const hostnameArray = document.location.hostname.split('.');
	let subdomain;

	if (hostnameArray.length > 1) {
		subdomain = hostnameArray[0];
	} else {
		subdomain = '';
		// TODO: add route to 404
		// FlowRouter.go('/404');
	}

	Meteor.call('findTenantBySubdomain', subdomain, (err, tenant) => {
		if (tenant) {
			Session.set('tenantId', tenant._id);
		} else {
			// TODO: add route to 404
			// FlowRouter.go('/404');
		}
	});
}

if (Meteor.userId()) {
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

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={HomeLayout} />
			<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
			<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
			<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
			<Route exact path="/commenters" component={CommentersPage} />
			<PrivateRoute exact path="/tags/:slug/edit" component={EditKeywordLayout} />
			<Route exact path="/tags/:slug" component={KeywordDetail} />
			<PrivateRoute exact path="/tags/create" component={AddKeywordLayout} />
			<Route path="/words" render={() => <KeywordsPage type="word" title="Words" />} />
			<Route path="/ideas" render={() => <KeywordsPage type="idea" title="Ideas" />} />
			<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
			<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />

			<Route component={NotFound} />
		</Switch>
	</BrowserRouter>
);

export default App;
