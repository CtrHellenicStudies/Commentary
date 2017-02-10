import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { mount } from 'react-mounter';

FlowRouter.notFound = {
  action() {
    // Render not found page here
    mount(NotFound);
  },
};

// Global subscription: user data is needed in almost all routes
let tenantId;
function subscriptions() {
	this.register('userData', Meteor.subscribe('userData'));
	this.register('commenters', Meteor.subscribe('commenters', this.tenantId));
	this.register('tenants', Meteor.subscribe('tenants'));
}
FlowRouter.subscriptions = subscriptions;

// check tenant and set document meta
FlowRouter.triggers.enter([(context) => {
	console.log(Session.get('tenantId'));
	if (!Session.get('tenantId')) {
		let hostnameArray = document.location.hostname.split('.');
		if (process.env.NODE_ENV === 'development') {
			subdomain = Meteor.settings.public.developmentSubdomain;
		} else if (hostnameArray.length > 1) {
			subdomain = hostnameArray[0];
		} else {
			subdomain = '';
			FlowRouter.go("/404");
		}

		console.log(subdomain);
		Meteor.call('findTenantBySubdomain', subdomain, function(err, tenant) {
			if (tenant) {
				Session.set('tenantId', tenant._id);
				this.tenantId = tenant._id;

				if (tenant.isAnnotation && !Meteor.userId()) {
					FlowRouter.go("/sign-in");
				}
			} else {
				FlowRouter.go("/404");
			}
		});
	}

	if (Meteor.isClient) {
		Utils.setBaseDocMeta();
	}

	if (Meteor.userId() && Session.get("tenantId")) {
		let tenant = Tenants.findOne({ _id: Session.get("tenantId") });

		if (tenant && tenant.isAnnotation && FlowRouter.current().path == "/")
			FlowRouter.go("/profile");
	}

	this.tenantId = Session.get("tenantId");
}]);

/*
 * Route groups with permissions
 */
loggedInGroup = FlowRouter.group({
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

FlowRouter.route('/keywords/add', {
	action: (params) => {
		mount(AddKeywordLayout);
	},
});

FlowRouter.route('/keywords/:slug/edit', {
	action: (params) => {
		mount(MasterLayout, {
			content: <EditKeywordLayout slug={params.slug} />,
		});
	},
});

FlowRouter.route('/keywords/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <KeywordDetail slug={params.slug} />,
		});
	},
});

FlowRouter.route('/keywords', {
	name: 'keywords',
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="word" title="Keywords" />,
		});
	},
});

FlowRouter.route('/keyideas', {
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
	name: 'CommentersDetail',
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

FlowRouter.route('/about', {
	action: () => {
		mount(MasterLayout, {
			content: <AboutPage />,
		});
	},
});


FlowRouter.route('/terms', {
	action: () => {
		mount(MasterLayout, {
			content: <TermsPage />,
		});
	},
});

loggedInGroup.route('/commentary/add', {
	action: () => {
		mount(AddCommentLayout);
	},
});

loggedInGroup.route('/commentary/:commentId/edit', {
	action: (params) => {
		mount(AddRevisionLayout, {
			commentId: params.commentId,
		});
	},
});

loggedInGroup.route('/profile', {
	action: () => {
		mount(UserLayout, {
			content: < ProfilePage />,
		});
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
			content: < AccountPage />,
		});
	},
});

loggedInGroup.route('/sign-out', {
	triggersEnter: [
		() => {
			AccountsTemplates.logout();
		},
	],
	action: () => {
		// Do nothing
	},
});


/*
* Single page view
* 404 check is in the actual template
*/
// FlowRouter.route('/:slug', {
// 	action(params) {
// 		// console.log(params);
// 		const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
// 		// console.log(reservedRoutes.indexOf(params.slug));
// 		if (reservedRoutes.indexOf(params.slug) === -1) {
// 			mount(MasterLayout, {
// 				content: <SinglePage slug={params.slug} />,
// 			});
// 		}
// 	},
// });
