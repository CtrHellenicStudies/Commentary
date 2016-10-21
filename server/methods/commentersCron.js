
Meteor.method("commenters_cron", function () {

		const comments = Comments.find().fetch();
		const commenters = [];

		let isInCommenters = false;



		comments.forEach(function(comment){
			comment.commenters.forEach(function(commentCommenter){
				isInCommenters = false;
				commenters.forEach(function(commenter){

					if(commenter.slug === commentCommenter.slug){
						isInCommenters = true;
						commenter.count++;
					}

				});

				if(!isInCommenters){
					commentCommenter.count = 0;
					commenters.push(commentCommenter);

				}

			});

		});


		commenters.forEach(function(commenter){

			console.log(commenter.title, commenter.count);

			Commenters.update({slug:commenter.slug}, {$set:{count: commenter.count}});


		});

		/*
		comments.forEach(function(comment){
			var nLines = 1;

			if('lineTo' in comment && comment.lineTo){
				nLines = comment.lineTo - comment.lineFrom + 1;
				// console.log(comment.lineFrom, comment.lineTo, comment.nLines);

			}

			Comments.update({_id: comment._id}, {$set:{nLines:nLines}});
		});
		*/


		console.log(" -- Cron run complete: Commenters")

		return 1;

	}, {
		url: "commenters/cron",
		getArgsFromRequest: function (request) {
			// Sometime soon do validation here
			var content = request.body;

			return [content];
		}
});
