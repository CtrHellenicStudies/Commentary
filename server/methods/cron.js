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
					work.nComments++;

					work.subworks.forEach(function(subwork){
						if(comment.subwork.n === subwork.n){
							isInCommentCountsSubworks = true;
							isInCommentCountsLines = false;
							subwork.nComments++;

							subwork.commentHeatmap.forEach(function(line){
								if(comment.lineFrom === line.n){
									isInCommentCountsLines = true;
									line.nComments++;
								}



							});

							if(!isInCommentCountsLines){
								subwork.commentHeatmap.push({
										n: comment.lineFrom,
										nComments: 1
								})

							}



						}


					});

					if(!isInCommentCountsSubworks){
						work.subworks.push({
								n: comment.subwork.n,
								title: comment.subwork.title,
								slug: comment.subwork.slug,
								nComments: 1,
								commentHeatmap: [{
									n: comment.lineFrom,
									nComments: 1
								}]

						});
					}

				}

			});

			if(!isInCommentCountsWorks){
				commentCounts.push({
					slug: comment.work.slug,
					nComments: 1,
					subworks: [{
						n: comment.subwork.n,
						title: comment.subwork.title,
						slug: comment.subwork.slug,
						nComments: 1,
						commentHeatmap: [{
							n: comment.lineFrom,
							nComments: 1
						}]
					}]
				})
			}




		});

		commentCounts.forEach(function(countsWork){
			var work = Works.findOne({slug: countsWork.slug});
			work.subworks.forEach(function(subwork){
				work.nComments = countsWork.nComments;
				countsWork.subworks.forEach(function(countsSubwork){
					if(subwork.n === countsSubwork.n){

						subwork.nComments = countsSubwork.nComments;
						subwork.commentHeatmap = countsSubwork.commentHeatmap;


					}

				});

			});


			var updateStatus = Works.update({slug: countsWork.slug}, {$set:{
														subworks: countsWork.subworks,
														nComments: countsWork.nComments
													}});
			console.log(countsWork, updateStatus);

		});

		console.log(" -- Cron run complete: Commentary")

		return 1;

	}, {
	  url: "commentary/cron",
	  getArgsFromRequest: function (request) {
			// Sometime soon do validation here
	    var content = request.body;

	    return [content];
	  }
});
