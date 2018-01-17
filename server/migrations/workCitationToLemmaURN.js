import Comments from '/imports/models/comments';


const tlgMappingForWorks = [{
	slug: 'iliad',
	tlg: 'tlg001',
	tlgAuthor: 'tlg0012',
}, {
	slug: 'odyssey',
	tlg: 'tlg002',
	tlgAuthor: 'tlg0012',
}, {
	slug: 'homeric-hymns',
	tlgAuthor: 'tlg0013',
	subworks: _.range(0, 33),
}, {
	slug: 'olympian',
	tlg: 'tlg001',
	tlgAuthor: 'tlg0033',
}, {
	slug: 'pythian',
	tlg: 'tlg002',
	tlgAuthor: 'tlg0033',
}, {
	slug: 'nemean',
	tlg: 'tlg003',
	tlgAuthor: 'tlg0033',
}, {
	slug: 'isthmean',
	tlg: 'tlg004',
	tlgAuthor: 'tlg0033',
}];


const workCitationToLemmaURN = () => {
	const comments = Comments.find().fetch();

	comments.forEach((comment) => {
		const lemmaCitation = {
			collection: 'urn:cts:greekLit',
			textGroup: null,
			work: null,
			passage: {},
		};

		tlgMappingForWorks.forEach(mapping => {
			if (
				comment.work
				&& comment.work.slug === mapping.slug
			) {
				lemmaCitation.textGroup = mapping.tlgAuthor;
				lemmaCitation.work = mapping.tlg;
			}
		});

		if (comment.subwork) {
			lemmaCitation.passage = `${comment.subwork.n}.${comment.lineFrom}`;

			if ('lineTo' in comment) {
				lemmaCitation.passage = `${lemmaCitation.passage}-${comment.subwork.n}.${comment.lineTo}`;
			}
		}

		try {
			Comments.update({
				_id: comment._id,
			}, {
				$set: {
					lemmaCitation,
				},
			});
		} catch (err) {
			throw new Error(`Error fixing comment.workCitationToLemmaURN ${comment._id}: ${err}`);
		}
	});

	console.log(' -- method comments workCitationToLemmaURN run completed');
};


Meteor.method('workCitationToLemmaURN', () => {
	workCitationToLemmaURN();
}, {
	url: 'comments/fix/workCitationToLemmaURN',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});


export default workCitationToLemmaURN;
