import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import Cookies from 'js-cookie';
import { mount } from 'react-mounter';

// lib
import Utils from '/imports/lib/utils';

// api
import Tenants from '/imports/api/collections/tenants';

// layouts
import CommentaryLayout from '/imports/ui/layouts/commentary/CommentaryLayout';
import AddCommentLayout from '/imports/ui/layouts/editor/AddCommentLayout';
import AddKeywordLayout from '/imports/ui/layouts/editor/AddKeywordLayout';
import AddRevisionLayout from '/imports/ui/layouts/editor/AddRevisionLayout';
import EditKeywordLayout from '/imports/ui/layouts/editor/EditKeywordLayout';
import HomeLayout from '/imports/ui/layouts/home/HomeLayout';
import MasterLayout from '/imports/ui/layouts/master/MasterLayout';
import UserLayout from '/imports/ui/layouts/user/UserLayout';
import NameResolutionServiceLayout from '/imports/ui/layouts/nameResolutionService/NameResolutionServiceLayout';
import NotFound from '/imports/ui/layouts/notFound/NotFound';

// components
import Page from '/imports/ui/components/pages/Page';
import CommentersPage from '/imports/ui/components/commenters/CommentersPage';
import CommenterDetail from '/imports/ui/components/commenters/CommenterDetail';
import KeywordsPage from '/imports/ui/components/keywords/KeywordsPage';
import KeywordDetail from '/imports/ui/components/keywords/KeywordDetail';
import ProfilePage from '/imports/ui/components/user/ProfilePage';
import PublicProfilePage from '/imports/ui/components/user/PublicProfilePage';
import ReferenceWorksPage from '/imports/ui/components/referenceWorks/ReferenceWorksPage';
import ReferenceWorkDetail from '/imports/ui/components/referenceWorks/ReferenceWorkDetail';

FlowRouter.notFound = {
	action() {
		mount(NotFound);
	},
};

// Global subscription: user data is needed in almost all routes
function subscriptions() {
	this.register('userData', Meteor.subscribe('userData'));
	this.register('commenters', Meteor.subscribe('commenters', this.tenantId));
	this.register('tenants', Meteor.subscribe('tenants'));
}
FlowRouter.subscriptions = subscriptions;

/*
 * Perform necessary checks on entering any route
 */
FlowRouter.triggers.enter([() => {

	/*
	 * Check for and set the tenantId of the current subdomain
	 */
	if (!Session.get('tenantId')) {
		const hostnameArray = document.location.hostname.split('.');
		let subdomain;

		if (hostnameArray.length > 1) {
			subdomain = hostnameArray[0];
		} else {
			subdomain = '';
			FlowRouter.go('/404');
		}

		Meteor.call('findTenantBySubdomain', subdomain, (err, tenant) => {
			if (tenant) {
				Session.set('tenantId', tenant._id);
				if (tenant.isAnnotation && !Meteor.userId()) {
					FlowRouter.go('/sign-in');
				}
			} else {
				FlowRouter.go('/404');
			}
		});
	}

	/*
	 * Check for multi-subdomain login cookie, if found, login user with Token
	 * if user is logged in and no cookie is found, set cookie
	 */

	if (Meteor.userId()) {
		if (!Cookies.get('loginToken')) {
			Meteor.call('getNewStampedToken', (_err, token) => {

				if (_err) {
					console.error(_err);
					return false;
				}

				const domain = Utils.setCookieDomain();

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

	/*
	 * Set the base document metadata for the page
	 */
	if (Meteor.isClient) {
		Utils.setBaseDocMeta();
	}
}]);

/*
 * Route groups with permissions
 */
const loggedInGroup = FlowRouter.group({
	triggersEnter: [AccountsTemplates.ensureSignedIn],
});

FlowRouter.route('/', {
	name: 'home',
	action: () => {
		mount(HomeLayout);
	},
});
FlowRouter.route('/commentary', {
	name: 'commentary',
	action: (params, queryParams) => {
		mount(CommentaryLayout, { params, queryParams });
	},
});

loggedInGroup.route('/tags/:slug/edit', {
	action: (params) => {
		mount(MasterLayout, {
			content: <EditKeywordLayout slug={params.slug} />,
		});
	},
});
loggedInGroup.route('/tags/create', {
	action: () => {
		mount(AddKeywordLayout);
	},
});
FlowRouter.route('/tags/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <KeywordDetail slug={params.slug} />,
		});
	},
});

FlowRouter.route('/tags/words', {
	name: 'tagwords',
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="word" title="Keywords" />,
		});
	},
});
FlowRouter.route('/tags/ideas', {
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="idea" title="Key Ideas" />,
		});
	},
});
FlowRouter.route('/referenceWorks/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <ReferenceWorkDetail slug={params.slug} />,
		});
	},
});
FlowRouter.route('/referenceWorks', {
	name: 'referenceWorks',
	action: () => {
		mount(MasterLayout, {
			content: <ReferenceWorksPage title="ReferenceWorks" />,
		});
	},
});
FlowRouter.route('/commenters/:slug', {
	name: 'CommentatorsDetail',
	action: (params) => {
		mount(MasterLayout, {
			content: <CommenterDetail
				slug={params.slug}
				defaultAvatarUrl="/images/default_user.jpg"
			/>,
		});
	},
});
FlowRouter.route('/commenters', {
	action: () => {
		mount(MasterLayout, {
			content: <CommentersPage />,
		});
	},
});

loggedInGroup.route('/commentary/:commentId/edit', {
	action: (params) => {
		mount(AddRevisionLayout, {
			commentId: params.commentId,
		});
	},
});
loggedInGroup.route('/commentary/create', {
	action: () => {
		mount(AddCommentLayout);
	},
});

loggedInGroup.route('/profile', {
	action: () => {
		mount(UserLayout, {
			content: <ProfilePage />,
		});
	},
});
FlowRouter.route('/commentary/:urn', {
	name: 'commentaryURN',
	action: (params, queryParams) => {
		mount(CommentaryLayout, { params, queryParams });
	},
});

FlowRouter.route('/users/:userId', {
	triggersEnter: [
		(context, redirect) => {
			if (Meteor.userId() && Meteor.userId() === context.params.userId) {
				redirect('/profile');
			}
		},
	],
	action: (params) => {
		mount(MasterLayout, {
			content: <PublicProfilePage
				userId={params.userId}
			/>,
		});
	},
});
FlowRouter.route('/users/:userId/:username', {
	triggersEnter: [
		(context, redirect) => {
			if (Meteor.userId() && Meteor.userId() === context.params.userId) {
				redirect('/profile');
			}
		},
	],
	action: (params) => {
		mount(MasterLayout, {
			content: <PublicProfilePage
				userId={params.userId}
			/>,
		});
	},
});
loggedInGroup.route('/account', {
	action: () => {
		mount(UserLayout, {
			content: <AccountPage />,
		});
	},
});
FlowRouter.route('/sign-out', {
	triggersEnter: [
		() => {
			try {
				AccountsTemplates.logout();
			} catch (err) {
				console.log(err);
			}
			cookie.remove('userId');
			cookie.remove('loginToken');
		},
	],
	action: () => {
		// Do nothing
	},
});

FlowRouter.route('/v1/urn:urn', {
	action(params) {
		const hostnameArray = document.location.hostname.split('.');
		let subdomain;

		if (hostnameArray.length > 1) {
			subdomain = hostnameArray[0];
		} else {
			subdomain = '';
			FlowRouter.go('/404');
		}

		if (subdomain !== 'nrs') {
			subdomain = '';
			FlowRouter.go('/404');
		}

		mount(MasterLayout, {
			content: <NameResolutionServiceLayout
				urn={params.urn}
				version="1.0"
			/>,
		});
	},
});

FlowRouter.route('/v1/doi:doi', {
	action(params) {
		const hostnameArray = document.location.hostname.split('.');
		let subdomain;

		if (hostnameArray.length > 1) {
			subdomain = hostnameArray[0];
		} else {
			subdomain = '';
			FlowRouter.go('/404');
		}

		if (subdomain !== 'nrs') {
			subdomain = '';
			FlowRouter.go('/404');
		}

		mount(MasterLayout, {
			content: <NameResolutionServiceLayout
				doi={params.doi}
				version="1.0"
			/>,
		});
	},
});

/*
 * Single page view
 * 404 check is in the actual template
 */
FlowRouter.route('/:slug', {
	action(params) {
		const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
		if (reservedRoutes.indexOf(params.slug) === -1) {
			mount(MasterLayout, {
				content: <Page slug={params.slug} />,
			});
		}
	},
});
