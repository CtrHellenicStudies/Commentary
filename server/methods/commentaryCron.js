Meteor.method("commentary_cron", function () {

		var comments = Comments.find().fetch();

		var commentCounts = [];
		var isInCommentCountsWorks = false;
		var isInCommentCountsSubworks = false;
		var isInCommentCountsLines = false;

		comments.forEach(function(comment){
			var nLines = 1;

			if('lineTo' in comment && comment.lineTo){
				nLines = comment.lineTo - comment.lineFrom + 1;
				// console.log(comment.lineFrom, comment.lineTo, comment.nLines);
			}

			Comments.update({_id: comment._id}, {$set:{nLines:nLines}});
		});


		comments.forEach(function(comment){

			let commentWorkSlug = '';

			if (commentWorkSlug === 'hymns') {
				commentWorkSlug = 'homeric-hymns';
			} else {
				commentWorkSlug = comment.work.slug
			}
			
			isInCommentCountsWorks = false;
			commentCounts.forEach(function(work){

				if(commentWorkSlug === work.slug){
					isInCommentCountsWorks = true;
					isInCommentCountsSubworks = false;
					work.nComments++;

					work.subworks.forEach(function(subwork){

						// TODO: build and array of lin 10 incrementation
						if(comment.subwork.n === subwork.n){
							isInCommentCountsSubworks = true;

							subwork.nComments++;

							var iterations = Math.floor((comment.lineFrom + comment.nLines - 1)/10) - Math.floor(comment.lineFrom/10) + 1;

							for (var i = 0; i < iterations; i++) {
								var nFrom = Math.floor(comment.lineFrom/10)*10 + i*10;
								isInCommentCountsLines = false;

								subwork.commentHeatmap.forEach(function(line){
									if(nFrom === line.n){
										isInCommentCountsLines = true;
										line.nComments++;
									}

								});

								if(!isInCommentCountsLines){
									subwork.commentHeatmap.push({
											n: nFrom,
											nComments: 1
									})

								}
							};
						}

					});

					if(!isInCommentCountsSubworks){
						work.subworks.push({
								n: comment.subwork.n,
								title: comment.subwork.title,
								slug: comment.subwork.slug,
								nComments: 1,
								commentHeatmap: [{
									n: Math.floor(comment.lineFrom/10)*10,
									nComments: 1
								}]

						});
					}

				}

			});

			if(!isInCommentCountsWorks){
				commentCounts.push({
					slug: commentWorkSlug,
					nComments: 1,
					subworks: [{
						n: comment.subwork.n,
						title: comment.subwork.title,
						slug: comment.subwork.slug,
						nComments: 1,
						commentHeatmap: [{
							n: Math.floor(comment.lineFrom/10)*10,
							nComments: 1,
						}]
					}]
				})
			}

		});

		// get a array of all subworks into tableOfContents
		var tableOfContents = [];
		Meteor.call('getTableOfContents', (err, res) => {
			if (err) {
				console.log(err);
			} else if (res) {
				tableOfContents = res;
			};
		});

		// search for subworks which have not been commented on
		// modify tableOfContents so only missing subworks are left
		commentCounts.forEach((work, i) => {
			var _work = tableOfContents.find(function(element, index, array) {
				return element._id === work.slug;
			});
			work.subworks.forEach((subwork, j) => {
				_work.subworks.forEach((n, k) => {
					if (n === subwork.n) {
						_work.subworks.splice(k, 1);
					};
				});
			});
		});

			// creat missing works and subworks from textNodes wwhich haven't been commented
			tableOfContents.forEach((_work, i) => {
					_work.subworks.forEach((n) => {

							var isInCommentCountsWorks = false;
							commentCounts.forEach((work) => {

									if (_work._id === work.slug) {
											isInCommentCountsWorks = true;

											work.subworks.push({
													n: n,
													title: n.toString(),
													nComments: 0,
													commentHeatmap: []
											});
									};
							});

							if (!isInCommentCountsWorks) {
									commentCounts.push({
											slug: _work._id,
											nComments: 0,
											subworks: [{
													n: n,
													title: n.toString(),
													nComments: 0,
													commentHeatmap: []
											}]
									});
							};
					});
			});


		commentCounts.forEach(function(countsWork){
			let workSlug = '';
			let work = {}

			if(countsWork.slug === 'hymns'){
				workSlug = 'homeric-hymns';
			}else {
				workSlug = countsWork.slug;
			}

			work = Works.findOne({slug: workSlug});

			work.subworks.forEach(function(subwork){
				work.nComments = countsWork.nComments;

				countsWork.subworks.forEach(function(countsSubwork){
					if(subwork.n === countsSubwork.n){

						subwork.nComments = countsSubwork.nComments;
						subwork.commentHeatmap = countsSubwork.commentHeatmap;

					}

				});

			});

			var updateStatus = Works.update({slug: workSlug}, {$set:{
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
