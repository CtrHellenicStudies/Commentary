import Comments from '/imports/api/collections/comments';
import Works from '/imports/api/collections/works';

Meteor.method('commentary_cron', () => {
	// console.log(' -- Starting cron: Commentary');

	const commentCounts = [];
	const isInCommentCountsWorks = false;
	let isInCommentCountsSubworks = false;
	let isInCommentCountsLines = false;

	// Set the number of lines for each comment
	Comments.find().forEach((comment) => {
		let nLines = 1;

		if (!('nLines' in comment) || !(comment.nLines)) {
			if ('lineTo' in comment && comment.lineTo) {
				nLines = (comment.lineTo - comment.lineFrom) + 1;
			}

			Comments.update({ _id: comment._id }, { $set: { nLines } });
		}
	});

	// For each work, get all comments in work and count the subwork comments and heatmap
	Works.find().forEach((work) => {
		// create work comment counts
		workCommentCounts = {
			slug: work.slug,
			nComments: 0,
			subworks: [],
		};

		// build work comment counts subworks
		work.subworks.forEach((subwork) => {
			workCommentCounts.subworks.push({
				n: subwork.n,
				title: subwork.title,
				slug: subwork.n.toString(),
				nComments: 0,
				commentHeatmap: [],
			});
		});

		// for each comment in this work, count it in work/subwork/heatmap
		Comments.find({ 'work.slug': work.slug }).forEach((comment) => {
			isInCommentCountsSubworks = false;
			workCommentCounts.nComments++;

			workCommentCounts.subworks.forEach((subwork, subworkIndex) => {
				if (comment.subwork.n === subwork.n) {
					isInCommentCountsLines = false;
					workCommentCounts.subworks[subworkIndex].nComments++;
					const iterations = (Math.floor(((comment.lineFrom + comment.nLines) - 1) / 10) -
						Math.floor(comment.lineFrom / 10)) + 1;
					let nFrom = (Math.floor(comment.lineFrom / 10) * 10);

					subwork.commentHeatmap.forEach((line, lineIndex) => {
						for (let j = 0; j < iterations; j++) {
							nFrom = (Math.floor(comment.lineFrom / 10) * 10) + (j * 10);
							if (nFrom === line.n) {
								isInCommentCountsLines = true;
								workCommentCounts.subworks[subworkIndex].commentHeatmap[lineIndex].nComments++;
							} else {
								isInCommentCountsLines = false;
							}
						}
					});
					if (!isInCommentCountsLines) {
						workCommentCounts.subworks[subworkIndex].commentHeatmap.push({
							n: nFrom,
							nComments: 1,
						});
					}
				}
			});
		});

		Works.update({ slug: work.slug }, {
			$set: {
				subworks: workCommentCounts.subworks,
				nComments: workCommentCounts.nComments,
			},
		});
	});

	console.log(' -- Cron run complete: Commentary');

	return 1;
}, {
	url: 'commentary/cron',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});
