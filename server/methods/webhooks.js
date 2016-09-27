
Meteor.method('keyword-webhook', (keywordCandidate) => {
	check(keywordCandidate.wordpressId, Number);
	check(keywordCandidate.slug, String);
	check(keywordCandidate.title, String);
	check(keywordCandidate.type, String);

	if (keywordCandidate.wordpressId <= 1) {
		throw new Meteor.Error(
			`wordpressId must be greater than 1; was ${keywordCandidate.wordpressId}`);
	}

	if (keywordCandidate.type !== 'word' && keywordCandidate.type !== 'idea') {
		throw new Meteor.Error(
			`type must be word or idea; was ${keywordCandidate.type}`);
	}

	const keywordDoc = {
		wordpressId: keywordCandidate.wordpressId,
		title: keywordCandidate.title,
		slug: keywordCandidate.slug,
		type: keywordCandidate.type,
	};

	const upsertResult = Keywords.upsert(
		{ wordpressId: keywordCandidate.wordpressId },
		{ $set: keywordDoc });

	console.log('keyword upsert: numberAffected=',
		upsertResult.numberAffected,
		', insertedId=',
		upsertResult.insertedId);
}, {
	url: 'keyword/webhook',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;
		return [content];
	},
});

Meteor.method('commentary-webhook', (commentCandidate) => {
	let valid = false;

	// console.log('Potential comment:', commentCandidate);
	// if (commentCandidate.keywords && commentCandidate.keywords.length > 0) {
	// 	console.log('keywords:', commentCandidate.keywords);
	// }

	const commenters = [];
	/*
	comment_candidate.commenters.forEach(function(commenter_wordpress_id, i){
		commenters.push(Commenters.findOne({wordpressId: commenter_wordpress_id}));
	});
	*/
	const commenter = Commenters.findOne({ wordpressId: commentCandidate.commenter });
	if (!commenter) {
		console.error(`Could not find commenter with wordpressId:${commentCandidate.commenter}`);
		return false;
	}
	commenters.push(commenter);
	const work = Works.findOne({ slug: commentCandidate.work });
	if (!work) {
		console.error(`Could not find work with slug:${commentCandidate.work}`);
		return false;
	}
	let subwork;
	work.subworks.forEach((workSubwork) => {
		if (workSubwork.n === parseInt(commentCandidate.subwork, 10)) {
			subwork = workSubwork;
		}
	});

	const keywords = [];
	commentCandidate.keywords.forEach((keywordWordpressId) => {
		keywords.push(Keywords.findOne({ wordpressId: keywordWordpressId }));
	});

	const text = commentCandidate.text.slice(0, 1) !== '<' ?
		'<p>${commentCandidate.text}</p>' :
		commentCandidate.text;

	let revision = Revisions.insert({
		title: commentCandidate.title,
		text,
	});

	/*
	 * Fix nested revision in the future
	 */
	if (revision) {
		revision = Revisions.findOne({ _id: revision });
	}

	const comment = Comments.findOne(commentCandidate.comment_id);

	let upsertResponse;

	// console.log("Work:", work);
	// console.log("Subwork:", subwork);
	// console.log("Commenters:", commenters);
	// console.log("Keywords:", keywords);
	// console.log("Revision:", revision);
	// console.log("Comment:", comment);

	if (comment) {
		upsertResponse = Comments.update(
			{ _id: commentCandidate._id },
			{ $addToSet: { revisions: revision } });
		console.log('Update response:', upsertResponse);
	} else {
		let nLines = 1;
		const commentOrder = 0;

		if ('line_to' in commentCandidate
			&& !isNaN(parseInt(commentCandidate.line_to, 10))
			&& commentCandidate.line_from !== commentCandidate.line_to) {
			nLines = (parseInt(commentCandidate.line_to, 10)
			- parseInt(commentCandidate.line_from, 10))
			+ 1;
		}

		const newComment = {
			wordpressId: commentCandidate.comment_id,
			commenters: [
				{
					wordpressId: commenters[0].wordpressId,
					name: commenters[0].name,
					slug: commenters[0].slug,
				},
			],
			work: {
				title: work.title,
				slug: work.slug,
				order: work.order,
			},
			subwork: {
				title: subwork.title,
				slug: subwork.slug,
				n: subwork.n,
			},
			lineFrom: parseInt(commentCandidate.line_from, 10),
			lineLetter: commentCandidate.line_letter,
			nLines,
			commentOrder,

			keywords,
			revisions: [revision],
			discussionComments: [],

			reference: commentCandidate.reference,
			referenceLink: commentCandidate.referenceLink,
			// referenceSection: null,
			// referenceChapter: null,
			// referenceTranslation: null,
			// referenceNote: null,
		};

		if ('line_to' in commentCandidate && !isNaN(commentCandidate.line_to)) {
			newComment.lineTo = parseInt(commentCandidate.line_to, 10);
		}

		const insertResponse = Comments.insert(newComment);
		if (insertResponse) {
			valid = true;
		}
	}

	return valid;
}, {
	url: 'commentary/webhook',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;
		return [content];
	},
});
