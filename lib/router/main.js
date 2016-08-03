/*
 * For the moment add subscriptions here; in future iterations, make them route
 * specific as necessary
 */

 FlowRouter.subscriptions = function(){
	 var limit = 10;

	 if(typeof Session.get("limit") === "undefined"){
		limit = 10;
	}else {
		limit = Session.get("limit");
	}
	console.log(limit);

   this.register('comments', Meteor.subscribe('comments', limit));
   this.register('commenters', Meteor.subscribe('commenters'));
   this.register('discussion_comments', Meteor.subscribe('discussion_comments'));
   this.register('keywords', Meteor.subscribe('keywords'));
   this.register('revisions', Meteor.subscribe('revisions'));
   this.register('users', Meteor.subscribe('users'));
 };


/*
 * Routes for application
 */


FlowRouter.route('/commentary/', {
    action: function(params, queryParams) {
        ReactLayout.render(CommentaryLayout, {params: params, queryParams: queryParams});
    },
		subscriptions: function(params, queryParams) {
			this.register('comments', Meteor.subscribe('comments', Session.get("limit")));
	}
});

FlowRouter.route('/', {
    action: function(params) {
        ReactLayout.render(HomeLayout);
    }

});

FlowRouter.route('/keywords/:slug', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<KeywordDetail />});
    }
});

FlowRouter.route('/keywords', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<KeywordsPage />});
    }
});

FlowRouter.route('/commenters/:slug', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<CommenterDetail />});
    }
});

FlowRouter.route('/commenters', {
    action: function(params) {
        ReactLayout.render(MasterLayout, {content:<CommentersPage />});
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

FlowRouter.route('/cron', {
    action: function(params) {
        ReactLayout.render(HomeLayout);
    }
});

FlowRouter.route('/webhook/:wordpressId', {
    action: function(params, queryParams) {
        console.log("Webhook POST:", params, queryParams);
    }
});
