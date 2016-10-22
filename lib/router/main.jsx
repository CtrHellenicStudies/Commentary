import React from 'react';
import { mount } from 'react-mounter';
import { Session } from 'meteor/session'

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

// FlowRouter.wait();

// Tracker.autorun(function() {
//		 // wait on roles to intialise so we can check is use is in proper role
//		 debugger;
//		 // console.log(Roles.subscription.ready());
//		 // if (Roles.subscription.ready() && !FlowRouter._initialized) {
//		 //		 FlowRouter.initialize()
//		 // }
// });

/*
 * Account routes
 */

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

/*
 * Route groups with permissions
 */
exposedGroupe = FlowRouter.group({
	triggersEnter: [
		(context, redirect) => {
			if (context.path !== '/sign-in') {
				Session.set('redirectAfterLogin', context.path);
			}
		},
	],
});

loggedInGroup = FlowRouter.group({
	triggersEnter: [
		(context, redirect, stop) => {
			if (Meteor.loggingIn() || Meteor.userId()) {
				route = FlowRouter.current();
			} else {
				if (context.path !== '/sign-in') {
					Session.set('redirectAfterLogin', context.path);
				}
				redirect('/sign-in');
			}
		},
	],
});

// commenterGroupe = loggedInGroup.group({
//		 // triggersEnter: [
//		 //		 function(context, redirect, stop) {
//		 //				 if (Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter'])) {
//		 //						 route = FlowRouter.current();
//		 //				 } else if (Meteor.userId()) {
//		 //						 redirect('/');
//		 //				 };
//		 //		 }
//		 // ],
// });

// Accounts.onLogin(function(user) {
//		 console.log('Session', Session);
//		 redirect = Session.get('redirectAfterLogin');
//		 if(redirect){
//				 FlowRouter.go(redirect);
//		 };
// });


/*
 * Routes for application
 */

loggedInGroup.route('/loggedin', {
	name: 'loggedin',
	triggersEnter: [
		(context, redirect) => {
			const redirectAfterLoginPath = Session.get('redirectAfterLogin');
			if (redirectAfterLoginPath) {
				redirect(redirectAfterLoginPath);
				Session.set('redirectAfterLogin', undefined);
			} else {
				redirect('home');
			}
		},
	],
});

exposedGroupe.route('/', {
	name: 'home',
	action: () => {
		mount(HomeLayout);
	},
});

exposedGroupe.route('/commentary', {
	name: 'commentary',
	action: (params, queryParams) => {
		mount(CommentaryLayout, { params, queryParams });
	},
});

exposedGroupe.route('/commentary/', {
	action: (params, queryParams) => {
		mount(CommentaryLayout, { params, queryParams });
	},
});

exposedGroupe.route('/keywords/:slug', {
	action: (params) => {
		mount(MasterLayout, {
			content: <KeywordDetail slug={params.slug} />,
		});
	},
});

exposedGroupe.route('/keywords', {
	name: 'keywords',
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="word" title="Keywords" />,
		});
	},
});

exposedGroupe.route('/keyideas', {
	action: () => {
		mount(MasterLayout, {
			content: <KeywordsPage type="idea" title="Key Ideas" />,
		});
	},
});

exposedGroupe.route('/commenters/:slug', {
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

exposedGroupe.route('/commenters', {
	action: () => {
		mount(MasterLayout, {
			content: <CommentersPage />,
		});
	},
});

exposedGroupe.route('/about', {
	action: () => {
		mount(MasterLayout, {
			content: <AboutPage />,
		});
	},
});


exposedGroupe.route('/terms', {
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

loggedInGroup.route('/account', {
	action: () => {
		mount(UserLayout, {
			content: < AccountPage / >,
		});
	},
});

exposedGroupe.route('/sign-out', {
	triggersEnter: [
		(context, redirect) => {
			AccountsTemplates.logout();
			redirect('/');
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
exposedGroupe.route('/:slug', {
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
