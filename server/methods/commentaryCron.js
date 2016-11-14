Meteor.method('commentary_cron', () => {
	const comments = Comments.find().fetch();

	const commentCounts = [];
	let isInCommentCountsWorks = false;
	let isInCommentCountsSubworks = false;
	let isInCommentCountsLines = false;

	comments.forEach((comment) => {
		let nLines = 1;

		if ('lineTo' in comment && comment.lineTo) {
			nLines = (comment.lineTo - comment.lineFrom) + 1;
			// console.log(comment.lineFrom, comment.lineTo, comment.nLines);
		}

		Comments.update({ _id: comment._id }, { $set: { nLines } });
	});


	comments.forEach((comment) => {
		let commentWorkSlug = '';

		if (commentWorkSlug === 'hymns') {
			commentWorkSlug = 'homeric-hymns';
		} else {
			commentWorkSlug = comment.work.slug;
		}

		isInCommentCountsWorks = false;
		commentCounts.forEach((work, workIndex) => {
			if (commentWorkSlug === work.slug) {
				isInCommentCountsWorks = true;
				isInCommentCountsSubworks = false;
				commentCounts[workIndex].nComments++;

				work.subworks.forEach((subwork, subworkIndex) => {
					// TODO: build and array of lin 10 incrementation
					if (comment.subwork.n === subwork.n) {
						isInCommentCountsSubworks = true;

						commentCounts[workIndex][subworkIndex].nComments++;

						const iterations = (Math.floor(((comment.lineFrom + comment.nLines) - 1) / 10) -
							Math.floor(comment.lineFrom / 10)) + 1;

						subwork.commentHeatmap.forEach((line, lineIndex) => {
							for (let i = 0; i < iterations; i++) {
								const nFrom = (Math.floor(comment.lineFrom / 10) * 10) + (i * 10);
								if (nFrom === line.n) {
									isInCommentCountsLines = true;
									commentCounts[workIndex][subworkIndex][lineIndex].nComments++;
								} else {
									isInCommentCountsLines = false;
								}
								if (!isInCommentCountsLines) {
									commentCounts[workIndex][subworkIndex].commentHeatmap.push({
										n: nFrom,
										nComments: 1,
									});
								}
							}
						});
					}
				});

				if (!isInCommentCountsSubworks) {
					commentCounts[workIndex].subworks.push({
						n: comment.subwork.n,
						title: comment.subwork.title,
						slug: comment.subwork.slug,
						nComments: 1,
						commentHeatmap: [{
							n: Math.floor(comment.lineFrom / 10) * 10,
							nComments: 1,
						}],

					});
				}
			}
		});

		if (!isInCommentCountsWorks) {
			commentCounts.push({
				slug: commentWorkSlug,
				nComments: 1,
				subworks: [{
					n: comment.subwork.n,
					title: comment.subwork.title,
					slug: comment.subwork.slug,
					nComments: 1,
					commentHeatmap: [{
						n: Math.floor(comment.lineFrom / 10) * 10,
						nComments: 1,
					}],
				}],
			});
		}
	});

	// get a array of all subworks into tableOfContents
	let tableOfContents = [];
	Meteor.call('getTableOfContents', (err, res) => {
		if (err) {
			console.log(err);
		} else if (res) {
			tableOfContents = res;
		}
	});

	// search for subworks which have not been commented on
	// modify tableOfContents so only missing subworks are left
	commentCounts.forEach((work) => {
		const _work = tableOfContents.find((element) => element._id === work.slug);
		work.subworks.forEach((subwork) => {
			_work.subworks.forEach((n, k) => {
				if (n === subwork.n) {
					_work.subworks.splice(k, 1);
				}
			});
		});
	});

	// creat missing works and subworks from textNodes wwhich haven't been commented
	tableOfContents.forEach((_work) => {
		_work.subworks.forEach((n) => {
			isInCommentCountsWorks = false;
			commentCounts.forEach((work) => {
				if (_work._id === work.slug) {
					isInCommentCountsWorks = true;

					work.subworks.push({
						n,
						title: n.toString(),
						nComments: 0,
						commentHeatmap: [],
					});
				}
			});

			if (!isInCommentCountsWorks) {
				commentCounts.push({
					slug: _work._id,
					nComments: 0,
					subworks: [{
						n,
						title: n.toString(),
						nComments: 0,
						commentHeatmap: [],
					}],
				});
			}
		});
	});


	commentCounts.forEach((countsWork) => {
		let workSlug = '';
		let work = {};

		if (countsWork.slug === 'hymns') {
			workSlug = 'homeric-hymns';
		} else {
			workSlug = countsWork.slug;
		}

		work = Works.findOne({ slug: workSlug });

		work.subworks.forEach((subwork, subworkIndex) => {
			work.nComments = countsWork.nComments;

			countsWork.subworks.forEach((countsSubwork, countsSubworkIndex) => {
				if (work[subworkIndex].n === countsWork[countsSubworkIndex].n) {
					work[subworkIndex].nComments = countsWork[countsSubworkIndex].nComments;
					work[subworkIndex].commentHeatmap = countsWork[countsSubworkIndex].commentHeatmap;
				}
			});
		});

		const updateStatus = Works.update({ slug: workSlug }, {
			$set: {
				subworks: countsWork.subworks,
				nComments: countsWork.nComments,
			},
		});
		console.log(countsWork, updateStatus);
	});

	console.log(' -- Cron run complete: Commentary');

	return 1;
}, {
	url: 'commentary/cron',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;

		return [content];
	},
});
