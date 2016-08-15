Meteor.method("cron", function () {

		var comments = Comments.find().fetch();

		var commentCounts = [];
		var isInCommentCountsWorks = false;
		var isInCommentCountsSubworks = false;
		var isInCommentCountsLines = false;

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


		comments.forEach(function(comment){

			isInCommentCountsWorks = false;
			commentCounts.forEach(function(work){

				if(comment.work.slug === work.slug){
					isInCommentCountsWorks = true;
					isInCommentCountsSubworks = false;
					work.count++;

					work.subworks.forEach(function(subwork){
						if(comment.subwork.n === subwork.n){
							isInCommentCountsSubworks = true;
							isInCommentCountsLines = false;
							subwork.count++;

							subwork.lines.forEach(function(line){
								if(comment.lineFrom === line.n){
									isInCommentCountsLines = true;
									line.count++;
								}



							});

							if(!isInCommentCountsLines){
								subwork.lines.push({
										n: comment.lineFrom,
										count: 1
								})

							}



						}


					});

					if(!isInCommentCountsSubworks){
						work.subworks.push({
								n: comment.subwork.n,
								count: 1,
								lines: [{
									n: comment.lineFrom,
									count: 1
								}]

						});
					}

				}

			});

			if(!isInCommentCountsWorks){
				commentCounts.push({
					slug: comment.work.slug,
					count: 1,
					subworks: [{
						n: comment.subwork.n,
						count: 1,
						lines: [{
							n: comment.lineFrom,
							count: 1
						}]
					}]
				})
			}




		});

		commentCounts.forEach(function(countsWork){
			var work = Work.find({slug: countsWork.slug});
			console.log(countsWork);

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
