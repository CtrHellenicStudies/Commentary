Meteor.method("cron", function () {

		var comments = Comments.find().fetch();

		comments.forEach(function(comment){

			var nLines = 1;

			if('lineTo' in comment && comment.lineTo){
				nLines = comment.lineTo - comment.lineFrom + 1;
				console.log(comment.lineFrom, comment.lineTo, comment.nLines);

			}

			Comments.update({_id: comment._id}, {$set:{nLines:nLines}});


		});

		return 1;

	}, {
	  url: "commentary/cron",
	  getArgsFromRequest: function (request) {
			// Sometime soon do validation here
	    var content = request.body;

	    return [content];
	  }
});
