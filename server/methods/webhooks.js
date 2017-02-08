Meteor.method('keyword-webhook', (keywordCandidate) => {
	check(keywordCandidate.wordpressId, Match.Maybe(Number));
	check(keywordCandidate.slug, String);
	check(keywordCandidate.title, String);
	check(keywordCandidate.type, String);
	check(keywordCandidate.subdomain, String);

	if (keywordCandidate.type !== 'word' && keywordCandidate.type !== 'idea') {
		throw new Meteor.Error(
			`type must be word or idea; was ${keywordCandidate.type}`);
	}

	const tenant = Tenants.findOne({subdomain: keywordCandidate.subdomain});

	if (!tenant) {
		throw new Meteor.Error(
			`could not find tenant for given subdomain; was ${keywordCandidate.subdomain}`);
	}

	const keywordDoc = {
		tenantId: tenant._id,
		title: keywordCandidate.title,
		slug: keywordCandidate.slug,
		type: keywordCandidate.type,
	};

	if (keywordCandidate.wordpressId) {
		keywordDoc.wordpressId = keywordCandidate.wordpressId;
	}

	const upsertResult = Keywords.upsert(
		{ slug: keywordCandidate.slug },
		{ $set: keywordDoc });

	/*
	console.log('keyword upsert: numberAffected=',
		upsertResult.numberAffected,
		', insertedId=',
		upsertResult.insertedId);
	*/
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
	check(commentCandidate.subdomain, String);
	check(commentCandidate.comment_id, Match.Maybe(Number));
	check(commentCandidate.title, String);

	const tenant = Tenants.findOne({ subdomain: commentCandidate.subdomain });

	if (!tenant) {
		throw new Meteor.Error(
			`could not find tenant for given subdomain; was ${commentCandidate.subdomain}`);
	}

	const commenters = [];

	// console.log('Potential comment:', commentCandidate);
	// if (commentCandidate.keywords && commentCandidate.keywords.length > 0) {
	// 	console.log('keywords:', commentCandidate.keywords);
	// }

	/*
	 comment_candidate.commenters.forEach(function(commenter_wordpress_id, i){
	 commenters.push(Commenters.findOne({wordpressId: commenter_wordpress_id}));
	 });
	 */
	let commenter = null;
	if (commentCandidate.commenter) {
		commenter = Commenters.findOne({ slug: commentCandidate.commenter });
	}
	if (!commenter) {
		console.error(`Could not find commenter with slug:${commentCandidate.commenter}`);
		// return false;
	} else {
		commenters.push(commenter);
	}

	const work = Works.findOne({ slug: commentCandidate.work });
	if (!work) {
		console.error(`Could not find work with slug:${commentCandidate.work}. Not creating comment or revision`);
		return false;
	}
	let subwork;
	work.subworks.forEach((workSubwork) => {
		if (workSubwork.n === parseInt(commentCandidate.subwork, 10)) {
			subwork = workSubwork;
		}
	});

	if (!subwork) {
		console.error(`Could not find subwork with n:${commentCandidate.subwork} work:${work.slug}`);
		// return false;
		if (commentCandidate.subwork) {
			const newSubwork = {
				title: String(commentCandidate.subwork),
				slug: String(commentCandidate.subwork),
				n: commentCandidate.subwork,
			};
			Works.update({ _id: work._id }, { $addToSet: { subworks: newSubwork } });
		} else {
			subwork = work.subworks[0];
		}
	}

	const keywords = [];
	if ('keywords' in commentCandidate) {
		commentCandidate.keywords.forEach((keywordWordpressId) => {
			keywords.push(Keywords.findOne({ wordpressId: keywordWordpressId }));
		});
	}

	const text = commentCandidate.text.slice(0, 1) !== '<' ?
		`<p>${commentCandidate.text}</p>` :
		commentCandidate.text;

	let comment = false;
	if ('comment_id' in commentCandidate) {
		comment = Comments.findOne(commentCandidate.comment_id);
	}

	let upsertResponse;
	// console.log("Work:", work);
	// console.log("Subwork:", subwork);
	// console.log("Commenters:", commenters);
	// console.log("Keywords:", keywords);
	// console.log("Revision:", revision);
	// console.log("Comment:", comment);

	if (comment) {
		let revisionExists = false;

		comment.revisions.forEach((revision) => {
			if (revision.text === text) {
				revisionExists = true;
			}
		});

		if (!revisionExists) {
			let revision = Revisions.insert({
				title: commentCandidate.title,
				text,
				tenantId: tenant._id,
			});

			if (revision) {
				revision = Revisions.findOne({ _id: revision });
			}
		}

		upsertResponse = Comments.update(
			{ _id: commentCandidate._id },
			{ $addToSet: { revisions: revision } });
		// console.log('Update response:', upsertResponse);

	} else {
		let nLines = 1;
		const commentOrder = 0;

		let revision = Revisions.insert({
			title: commentCandidate.title,
			text,
			tenantId: tenant._id,
		});

		if (revision) {
			revision = Revisions.findOne({ _id: revision });
		}

		if ('line_to' in commentCandidate
			&& !isNaN(parseInt(commentCandidate.line_to, 10))
			&& commentCandidate.line_from !== commentCandidate.line_to) {
			nLines = (parseInt(commentCandidate.line_to, 10)
				- parseInt(commentCandidate.line_from, 10))
				+ 1;
		}

		const newComment = {
			tenantId: tenant._id,
			wordpressId: commentCandidate.comment_id,
			commenters: [],
			work: {
				title: work.title,
				slug: work.slug,
				order: work.order,
			},
			subwork: {
				title: ((subwork && 'title' in subwork) ? subwork.title : subwork.n),
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

		let newCommenter;
		if (commenters.length) {
			commenters.forEach((_commenter) => {
				newCommenter = {
					name: _commenter.name,
					slug: _commenter.slug,
				};

				if ('wordpressId' in _commenter) {
					newCommenter.wordpressId = _commenter.wordpressId;
				}

				newComment.commenters.push(newCommenter);
			});
		}

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
