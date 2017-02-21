
import Comments from '/imports/collections/comments';
import Commenters from '/imports/collections/commenters';

Meteor.method('commenters_cron', () => {
	// console.log(' -- Starting cron: Commenters');

	const comments = Comments.find().fetch();
	const commenters = [];

	let isInCommenters = false;
	let isInCommentCountsLines = false;

	comments.forEach((comment, commentIndex) => {
		comment.commenters.forEach((commentCommenter, commentCommenterIndex) => {
			isInCommenters = false;
			commenters.forEach((commenter, commenterIndex) => {
				if (commenter.slug === commentCommenter.slug) {
					isInCommenters = true;
					commenters[commenterIndex].nCommentsTotal++;

					switch (comment.work.slug) {
					case 'iliad':
						commenters[commenterIndex].nCommentsIliad++;
						break;
					case 'odyssey':
						commenters[commenterIndex].nCommentsOdyssey++;
						break;
					case 'homeric-hymns':
						commenters[commenterIndex].nCommentsHymns++;
						break;
					case 'hymns':
						commenters[commenterIndex].nCommentsHymns++;
						break;
					default:
						break;
					}
					commenter.nCommentsWorks.forEach((work, workIndex) => {
						if (comment.work.slug === work.slug) {
							work.subworks.forEach((subwork, subworkIndex) => {
								// TODO: build and array of lin 10 incrementation
								if (comment.subwork.n === subwork.n) {
									commenters[commenterIndex].nCommentsWorks[workIndex].subworks[subworkIndex].nComments++;

									const iterations = (Math.floor(((comment.lineFrom + comment.nLines) - 1) / 10) -
										Math.floor(comment.lineFrom / 10)) + 1;

									subwork.commentHeatmap.forEach((line, lineIndex) => {
										for (let i = 0; i < iterations; i++) {
											const nFrom = (Math.floor(comment.lineFrom / 10) * 10) + (i * 10);
											if (nFrom === line.n) {
												isInCommentCountsLines = true;
												commenters[commenterIndex][workIndex][subworkIndex][lineIndex]
													.nComments++;
											} else {
												isInCommentCountsLines = false;
											}

											if (!isInCommentCountsLines) {
												subwork.commentHeatmap.push({
													n: nFrom,
													nComments: 1,
												});
											}
										}
									}); // subwork.commentHeatmap.forEach
								}
							}); // work.subworks.forEach
						}
					}); // commenters.nCommentsWorks.forEach
				}
			}); // commenters.forEach

			if (!isInCommenters) {
				comments[commentIndex].commenters[commentCommenterIndex].nCommentsTotal = 0;
				comments[commentIndex].commenters[commentCommenterIndex].nCommentsIliad = 0;
				comments[commentIndex].commenters[commentCommenterIndex].nCommentsOdyssey = 0;
				comments[commentIndex].commenters[commentCommenterIndex].nCommentsHymns = 0;
				comments[commentIndex].commenters[commentCommenterIndex].nCommentsWorks = [];

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
		}); // comment.commenters.forEach
	}); // comments.forEach

	commenters.forEach((commenter) => {
		// console.log(' -- -- ', commenter.name, commenter.nCommentsTotal);
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
