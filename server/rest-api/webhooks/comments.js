import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import Keywords from '/imports/models/keywords';
import ReferenceWorks from '/imports/models/referenceWorks';
import Tenants from '/imports/models/tenants';
import Settings from '/imports/models/settings';
import Works from '/imports/models/works';

Meteor.method('publishComments', (commentCandidate) => {
	let valid = false;
	check(commentCandidate.subdomain, String);
	check(commentCandidate.wordpressId, Match.Maybe(Number));
	check(commentCandidate.title, String);
	check(commentCandidate.token, String);
	check(commentCandidate.created, Number);
	check(commentCandidate.updated, Number);

	const tenant = Tenants.findOne({ subdomain: commentCandidate.subdomain });
	const settings = Settings.findOne({ tenantId: tenant._id });

	if (!settings || settings.webhooksToken !== commentCandidate.token) {
		throw new Meteor.Error('Webhook publishing not authorized');
	}

	if (!tenant) {
		throw new Meteor.Error(
			`could not find tenant for given subdomain; was ${commentCandidate.subdomain}`);
	}

	const commenters = [];
	let commenter = null;
	if (commentCandidate.commenter) {
		commenter = Commenters.findOne({ slug: commentCandidate.commenter });
	}
	if (!commenter) {
		console.error(`Could not find commenter with slug:${commentCandidate.commenter}`);
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
		commentCandidate.keywords.forEach((keywordSlug) => {
			let _keyword = Keywords.findOne({ slug: keywordSlug });
			if (_keyword) {
				keywords.push(_keyword);
			} else {
				console.error(`Could not find keyword with wordpressId: ${keywordSlug}. Not creating comment or revision`);
			}
		});
	}

	const text = commentCandidate.text.slice(0, 1) !== '<' ?
		`<p>${commentCandidate.text}</p>` :
		commentCandidate.text;

	let comment = false;
	if ('wordpressId' in commentCandidate) {
		comment = Comments.findOne({ wordpressId: commentCandidate.wordpressId });
	}

	let referenceWork;
	if ('reference' in commentCandidate) {
		referenceWork = ReferenceWorks.findOne({ title: commentCandidate.reference });
	}
	let originalDate = new Date(commentCandidate.updated * 1000);
	// 1410643512 is the date of the primary ingest into the Wordpress database
	if (referenceWork) {
		if (parseInt(commentCandidate.updated, 10) === 1410643512) {
			originalDate = referenceWork.date;
		}
	}

	let upsertResponse;
	if (comment) {
		let revisionExists = false;

		comment.revisions.forEach((revision) => {
			if (revision.text === text) {
				revisionExists = true;
			}
		});

		if (!revisionExists) {
			let revisionId = new Mongo.ObjectID();
			let revision = {
				title: commentCandidate.title,
				text,
				tenantId: tenant._id,
				originalDate,
				_id: revisionId.valueOf(),
			};
			upsertResponse = Comments.update(
				{ _id: commentCandidate._id },
				{ $addToSet: { revisions: revision } });
		}

	} else {
		let nLines = 1;
		const commentOrder = 0;

		let revisionId = new Mongo.ObjectID();
		let revision = {
			title: commentCandidate.title,
			text,
			tenantId: tenant._id,
			originalDate,
			_id: revisionId.valueOf(),
		};

		if ('line_to' in commentCandidate
			&& !isNaN(parseInt(commentCandidate.line_to, 10))
			&& commentCandidate.line_from !== commentCandidate.line_to) {
			nLines = (parseInt(commentCandidate.line_to, 10)
				- parseInt(commentCandidate.line_from, 10))
				+ 1;
		}

		const newComment = {
			tenantId: tenant._id,
			wordpressId: commentCandidate.wordpressId,
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
			originalDate,
			status: 'publish',

			keywords,
			revisions: [revision],
			discussionComments: [],

			// referenceSection: null,
			// referenceChapter: null,
			// referenceTranslation: null,
			// referenceNote: null,
		};

		if (referenceWork) {
			newComment.referenceId = referenceWork._id;
		}

		let newCommenter;
		if (commenter) {
			newComment.commenters.push({
				_id: commenter._id,
				name: commenter.name,
				slug: commenter.slug,
				wordpressId: commenter.wordpressId,
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
	url: 'comments/webhook',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});
