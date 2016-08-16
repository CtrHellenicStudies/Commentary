import React from 'react';
import {mount} from 'react-mounter';


/*
 * For the moment add subscriptions here; in future iterations, make them route
 * specific as necessary
 */

 FlowRouter.subscriptions = function(){
   this.register('commenters', Meteor.subscribe('commenters'));
   this.register('discussionComments', Meteor.subscribe('discussionComments'));
   this.register('keywords', Meteor.subscribe('keywords'));
   this.register('works', Meteor.subscribe('works'));
   this.register('users', Meteor.subscribe('users'));
 };


/*
 * Routes for application
 */


FlowRouter.route('/commentary', {
    action: function(params, queryParams) {
        ReactLayout.render(CommentaryLayout, {params: params, queryParams: queryParams});
    }
});
FlowRouter.route('/commentary/', {
    action: function(params, queryParams) {
        ReactLayout.render(CommentaryLayout, {params: params, queryParams: queryParams});
    }
});

FlowRouter.route('/', {
    action: function(params, queryParams){
        mount(HomeLayout);
    }
});

FlowRouter.route('/keywords/:slug', {
    action: function(params, queryParams){
        mount(MasterLayout, {
            content: <KeywordDetail slug={params.slug}/>
        });
    }
});

FlowRouter.route('/keywords', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<KeywordsPage />});
    }
});

FlowRouter.route('/commenters/:slug', {
    name: 'CommentersDetail',
    action: function(params, queryParams){
        mount(MasterLayout, {
            content: <CommenterDetail slug={params.slug}/>
        });
    }
});


FlowRouter.route('/commenters', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<CommentersPage />});
    }
});

FlowRouter.route('/sign-in', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:""});
    }
});
FlowRouter.route('/sign-up', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:""});
    }
});

FlowRouter.route('/about', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<AboutPage />});
    }
});


FlowRouter.route('/terms', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<TermsPage />});
    }
});
