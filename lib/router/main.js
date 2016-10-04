import React from 'react';
import {mount} from 'react-mounter';
import { Session } from 'meteor/session'

/*
 * For the moment add subscriptions here; in future iterations, make them route
 * specific as necessary
 */

FlowRouter.subscriptions = function() {
    this.register('commenters', Meteor.subscribe('commenters'));
    this.register('discussionComments', Meteor.subscribe('discussionComments'));
    this.register('keywords', Meteor.subscribe('keywords'));
    this.register('works', Meteor.subscribe('works'));
    this.register('users', Meteor.subscribe('users'));
    this.register('referenceWorks', Meteor.subscribe('referenceWorks'));
    this.register('userData', Meteor.subscribe('userData'));
};


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
        function(context, redirect) {
            if (context.path != '/sign-in') {
                Session.set('redirectAfterLogin', context.path);
            };
        }
    ]
});

loggedInGroup = FlowRouter.group({
    triggersEnter: [
        function(context, redirect, stop) {
            if (Meteor.loggingIn() || Meteor.userId()) {
                route = FlowRouter.current();
            } else {
                // if(context.path != '/sign-in'){
                //     Session.set('redirectAfterLogin', context.path);
                // };
                redirect('/sign-in');
            }
        }
    ]
});

commenterGroupe = loggedInGroup.group({
    triggersEnter: [
        function(context, redirect, stop) {
            if (Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter'])) {
                route = FlowRouter.current();
            } else {
                redirect('/sign-in');
            };
        }
    ],
});

// Accounts.onLogin(function(user) {
//     console.log('Session', Session);
//     redirect = Session.get('redirectAfterLogin');
//     if(redirect){
//         FlowRouter.go(redirect);
//     };
// });


/*
 * Routes for application
 */

loggedInGroup.route('/loggedin', {
    name: 'loggedin',
    triggersEnter: [function(context, redirect) {
        var redirectAfterLoginPath = Session.get('redirectAfterLogin');
        if(redirectAfterLoginPath){
            redirect(redirectAfterLoginPath);
            Session.set('redirectAfterLogin', undefined);
        } else {
            redirect('home');
        };
    }]
});

exposedGroupe.route('/', {
	name: 'home',
	action: function(params, queryParams){
			mount(HomeLayout);
	}
});

exposedGroupe.route('/commentary', {
	name: 'commentary',
	action: function(params, queryParams) {
			mount(CommentaryLayout, {params: params, queryParams: queryParams});
	}
});

exposedGroupe.route('/commentary/', {
		action: function(params, queryParams) {
				mount(CommentaryLayout, {params: params, queryParams: queryParams});
		}
});

exposedGroupe.route('/keywords/:slug', {
		action: function(params, queryParams){
				mount(MasterLayout, {
						content: <KeywordDetail slug={params.slug}/>
				});
		}
});

exposedGroupe.route('/keywords', {
		name: 'keywords',
		action: function(params) {
				mount(MasterLayout, {content:<KeywordsPage type="word" title="Keywords" />});
		}
});

exposedGroupe.route('/keyideas', {
		action: function(params) {
				mount(MasterLayout, {content:<KeywordsPage type="idea" title="Key Ideas" />});
		}
});

exposedGroupe.route('/commenters/:slug', {
		name: 'CommentersDetail',
		action: function(params, queryParams){
				mount(MasterLayout, {
						content: <CommenterDetail slug={params.slug}/>
				});
		}
});

exposedGroupe.route('/commenters', {
		action: function(params) {
				mount(MasterLayout, {content:<CommentersPage />});
		}
});

exposedGroupe.route('/about', {
		action: function(params) {
				mount(MasterLayout, {content:<AboutPage />});
		}
});


exposedGroupe.route('/terms', {
		action: function(params) {
				mount(MasterLayout, {content:<TermsPage />});
		}
});

commenterGroupe.route('/add-comment', {
		action: function(params) {
				mount(AddCommentLayout);
		}
});

commenterGroupe.route('/add-revision/:commentId', {
		action: function(params) {
				mount(AddRevisionLayout, {commentId: params.commentId});
		}
});

loggedInGroup.route('/profile', {
    action: function(params) {
        mount(UserLayout, {
            content: < ProfilePage / >
        });
    }
});

loggedInGroup.route('/account', {
    action: function(params) {
        mount(UserLayout, {
            content: < AccountPage / >
        });
    }
});

exposedGroupe.route('/sign-out', {
    triggersEnter: [
        function(context, redirect) {
            AccountsTemplates.logout();
            redirect('/');
        }
    ],
    action: function(params) {
        // Do nothing
    },
});