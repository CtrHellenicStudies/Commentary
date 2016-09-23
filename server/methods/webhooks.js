Meteor.method("commentary-webhook", function (comment_candidate) {

	var valid = false;

	//console.log("Potential comment:", comment_candidate);

	let commenters = [];
	/*
	comment_candidate.commenters.forEach(function(commenter_wordpress_id, i){
		commenters.push(Commenters.findOne({wordpressId: commenter_wordpress_id}));
	});
	*/
	commenters.push(Commenters.findOne({wordpressId: comment_candidate.commenter}));


	let work = Works.findOne({slug: comment_candidate.work})
	let subwork;
	work.subworks.forEach(function(work_subwork){
		if(work_subwork.n === parseInt(comment_candidate.subwork)){
				subwork = work_subwork;

		}
	});

	let keywords = [];
	comment_candidate.keywords.forEach(function(keyword_wordpress_id, i){
		keywords.push(Keywords.findOne({wordpressId: keyword_wordpress_id}));
	});

	if(comment_candidate.text.slice(0,1) !== "<"){
		comment_candidate.text = "<p>" + comment_candidate.text + "</p>";
	}


	let revision = Revisions.insert({
		title: comment_candidate.title,
		text: comment_candidate.text

	});

	/*
	 * Fix nested revision in the future
	 */
	if(revision){
		revision = Revisions.findOne({_id:revision});
	}

	let comment = Comments.findOne(comment_candidate.comment_id);

	let upsert_response;

	//console.log("Work:", work);
	//console.log("Subwork:", subwork);
	//console.log("Commenters:", commenters);
	//console.log("Keywords:", keywords);
	//console.log("Revision:", revision);
	//console.log("Comment:", comment);

	if(comment){
			upsert_response = Comments.update({_id: comment_candidate._id}, {$addToSet: {revisions: revision}});
			console.log("Update response:", upsert_response);

	}else {

			let nLines = 1;
			let commentOrder = 0;
			let reference = "";

			if('line_to' in comment_candidate && !isNaN(parseInt(comment_candidate.line_to)) && comment_candidate.line_from !== comment_candidate.line_to){
				nLines = parseInt(comment_candidate.line_to) - parseInt(comment_candidate.line_from) + 1;
			}

			let new_comment = {
				wordpressId: comment_candidate.comment_id,
				commenters: [
					{
						wordpressId: commenters[0].wordpressId,
						name: commenters[0].name,
						slug: commenters[0].slug,
					}
				],
				work: {
					title: work.title,
					slug: work.slug,
					order: work.order
				},
				subwork: {
					title: subwork.title,
					slug: subwork.slug,
					n: subwork.n,
				},
				lineFrom: parseInt(comment_candidate.line_from),
				lineLetter: comment_candidate.line_letter,
				nLines: nLines,
				commentOrder: commentOrder,

				keywords: keywords,
				revisions: [revision],
				discussionComments: [],

				reference: comment_candidate.reference,
				referenceLink: comment_candidate.referenceLink,
				//referenceSection: null,
				//referenceChapter: null,
				//referenceTranslation: null,
				//referenceNote: null,



			};

			if('line_to' in comment_candidate && !isNaN(comment_candidate.line_to)){
				new_comment.lineTo = parseInt(comment_candidate.line_to);

			}


			insert_response = Comments.insert(new_comment);
			console.log("New comment:", insert_response);

	}



	return valid;

}, {
	url: "commentary/webhook",
	getArgsFromRequest: function (request) {
		// Sometime soon do validation here
		var content = request.body;

		return [content];
	}
});
