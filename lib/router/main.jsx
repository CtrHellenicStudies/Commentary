import React from "react";
import {mount} from "react-mounter";
/*
 * For the moment add subscriptions here; in future iterations, make them route
 * specific as necessary
 */

function subscriptions() {
	this.register('commenters', Meteor.subscribe('commenters'));
	this.register('keywords', Meteor.subscribe('keywords'));
	this.register('works', Meteor.subscribe('works'));
	this.register('users', Meteor.subscribe('users'));
	this.register('referenceWorks', Meteor.subscribe('referenceWorks'));
	this.register('userData', Meteor.subscribe('userData'));
}

FlowRouter.subscriptions = subscriptions;

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
		mount(CommentaryLayout, {params, queryParams});
	},
});

FlowRouter.route('/commentary/', {
	action: (params, queryParams) => {
		mount(CommentaryLayout, {params, queryParams});
	},
});

FlowRouter.route('/keywords/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <KeywordDetail slug={params.slug}/>,
		});
	},
});

FlowRouter.route('/keywords', {
	name: 'keywords',
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="word" title="Keywords"/>,
		});
	},
});

FlowRouter.route('/keyideas', {
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="idea" title="Key Ideas"/>,
		});
	},
});

FlowRouter.route('/referenceWorks/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <ReferenceWorkDetail slug={params.slug}/>,
		});
	},
});

FlowRouter.route('/referenceWorks', {
	name: 'referenceWorks',
	action: () => {
		mount(MasterLayout, {
			content: <ReferenceWorksPage title="ReferenceWorks"/>,
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

loggedInGroup.route('/add-comment', {
	action: () => {
		mount(AddCommentLayout);
	},
});

loggedInGroup.route('/add-revision/:commentId', {
	action: (params) => {
		mount(AddRevisionLayout, {
			commentId: params.commentId,
		});
	},
});

loggedInGroup.route('/profile', {
	action: () => {
		mount(UserLayout, {
			content: < ProfilePage / >,
		});
		},
		});

		FlowRouter.route('/users/:userId', {
	subscriptions(params) {
		this.register('allUsers', Meteor.subscribe('allUsers', params.userId));
		this.register('userDiscussionComments',
			Meteor.subscribe('userDiscussionComments', params.userId));
	},
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
	subscriptions(params) {
		this.register('allUsers', Meteor.subscribe('allUsers', params.userId));
		this.register('userDiscussionComments',
			Meteor.subscribe('userDiscussionComments', params.userId));
	},
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
			content: < AccountPage / >,
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
FlowRouter.route('/:slug', {
	action(params) {
		// console.log(params);
		const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
		// console.log(reservedRoutes.indexOf(params.slug));
		if (reservedRoutes.indexOf(params.slug) === -1) {
			mount(MasterLayout, {
				content: <SinglePage slug={params.slug} />,
			});
		}
	},
});
