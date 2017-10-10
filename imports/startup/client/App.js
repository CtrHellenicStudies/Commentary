import {BrowserRouter, Switch, Route} from 'react-router-dom';
import React from 'react';
import {Session} from 'meteor/session';

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

console.log('App LOG');

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={HomeLayout} />
			<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
			<Route exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
		</Switch>
	</BrowserRouter>
);

export default App;
