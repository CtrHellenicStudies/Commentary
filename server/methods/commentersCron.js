Meteor.method('commenters_cron', () => {
	const comments = Comments.find().fetch();
	const commenters = [];

	let isInCommenters = false;

	comments.forEach((comment) => {
		comment.commenters.forEach((commentCommenter) => {
			isInCommenters = false;
			commenters.forEach((commenter) => {
				if (commenter.slug === commentCommenter.slug) {
					isInCommenters = true;
					commenter.nCommentsTotal++;
					switch (comment.work.slug) {
					case 'iliad': {
						commenter.nCommentsIliad++;
						break;
					}
					case 'odyssey': {
						commenter.nCommentsOdyssey++;
						break;
					}
					case 'homeric-hymns': {
						commenter.nCommentsHymns++;
						break;
					}
					case 'hymns': {
						commenter.nCommentsHymns++;
						break;
					}
					default: {
						break;
					} }
				}

				commenter.nCommentsWorks.forEach((work) => {
					if (comment.work.slug === work.slug) {
						work.subworks.forEach((subwork) => {
							if (subwork.n === comment.subwork.n) {
								subwork.nComments++;
								let isInHeatmap = false;
								subwork.commentHeatmap.forEach((commentGroup) => {
									if (commentGroup.n === comment.lineFrom) {
										commentGroup.nComments++;
										isInHeatmap = true;
									}
								});
								if (!isInHeatmap) {
									subwork.commentHeatmap.push({
										n: comment.lineFrom,
										nComments: 1,
									});
								}
							}
						});
					}
				});
			});

			if (!isInCommenters) {
				commentCommenter.nCommentsTotal = 0;
				commentCommenter.nCommentsIliad = 0;
				commentCommenter.nCommentsOdyssey = 0;
				commentCommenter.nCommentsHymns = 0;
				commentCommenter.nCommentsWorks = [];

				const iliad = {
					title: 'Iliad',
					slug: 'iliad',
					subworks: [],
				};
				const odyssey = {
					title: 'Odyssey',
					slug: 'odyssey',
					subworks: [],
				};
				const hymns = {
					title: 'Homeric Hymns',
					slug: 'homeric-hymns',
					subworks: [],
				};

				for (let i = 1; i <= 24; i++) {
					iliad.subworks.push({
						title: String(i),
						slug: String(i),
						n: i,
						nComments: 0,
						commentHeatmap: [],
					});
					odyssey.subworks.push({
						title: String(i),
						slug: String(i),
						n: i,
						nComments: 0,
						commentHeatmap: [],
					});
				}

				for (let i = 1; i <= 33; i++) {
					hymns.subworks.push({
						title: String(i),
						slug: String(i),
						n: i,
						nComments: 0,
						commentHeatmap: [],
					});
				}

				commentCommenter.nCommentsWorks.push(iliad);
				commentCommenter.nCommentsWorks.push(odyssey);
				commentCommenter.nCommentsWorks.push(hymns);

				commenters.push(commentCommenter);
			}
		});
	});

	commenters.forEach((commenter) => {
		console.log(commenter.name, commenter.nCommentsTotal);
		Commenters.update({
			slug: commenter.slug,
		}, {
			$set: {
				nCommentsTotal: commenter.nCommentsTotal,
				nCommentsWorks: commenter.nCommentsWorks,
				nCommentsIliad: commenter.nCommentsIliad,
				nCommentsOdyssey: commenter.nCommentsOdyssey,
				nCommentsHymns: commenter.nCommentsHymns,
			},
		});
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


	console.log(' -- Cron run complete: Commenters');

	return 1;
}, {
	url: 'commenters/cron',
	getArgsFromRequest: (request) => {
		// Sometime soon do validation here
		const content = request.body;

		return [content];
	},
});
