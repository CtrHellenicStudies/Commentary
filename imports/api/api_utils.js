
export function queryCommentWithKeyword(keyword_slug) {
	return Comments.find({
		'keywords.slug': keyword_slug,
	}, {
		limit:1,
		fields: {
			'work.slug':1,
			'subwork.n':1,
			'keywords.slug':1,
			lineFrom:1,
			lineTo:1,
			nLines:1,
		}
	});
}

export function makeKeywordContextQueryFromComment(comment, maxLines) {
	let lineTo = comment.lineFrom;
	if (comment.hasOwnProperty('lineTo')) {
		lineTo = comment.lineFrom + Math.min(
				maxLines,
				comment.lineTo - comment.lineFrom
			);
	} else if (comment.hasOwnProperty('nLines')) {
		lineTo = comment.lineFrom + Math.min(maxLines, comment.nLines);
	}

	return {
		'work.slug': comment.work.slug,
		'subwork.n': comment.subwork.n,
		'text.n': {
			$gte: comment.lineFrom,
			$lte: lineTo,
		},
	};
}