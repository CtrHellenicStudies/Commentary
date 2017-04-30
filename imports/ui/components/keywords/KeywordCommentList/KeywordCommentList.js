import React from 'react';
import Commenters from '/imports/api/collections/commenters';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

const createRevisionMarkup = (html) => {
	let newHtml = html;

	const workNamesSpace = [{
		title: 'Iliad',
		slug: 'iliad',
	}, {
		title: 'Odyssey',
		slug: 'odyssey',
	}, {
		title: 'Homeric Hymns',
		slug: 'hymns',
	}, {
		title: 'Hymns',
		slug: 'hymns',
	}];
	const workNamesPeriod = [{
		title: 'Il',
		slug: 'iliad',
	}, {
		title: 'Od',
		slug: 'odyssey',
	}, {
		title: 'HH',
		slug: 'hymns',
	}, {
		title: 'I',
		slug: 'iliad',
	}, {
		title: 'O',
		slug: 'odyssey',
	}];

	let regex1;
	let regex2;

	workNamesSpace.forEach((workName) => {
		// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex1 = new RegExp(`${workName.title} (\\d+).(\\d+)-(\\d+)(?!.*&quot;)`, 'g');

		// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex2 = new RegExp(`${workName.title} (\\d+).(?!\\d+-\\d+)(\\d+)(?!.*&quot;)`, 'g');

		newHtml = newHtml.replace(regex1,
			`<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$1'
				data-lineFrom='$2'
				data-lineTo='$3'
			>${workName.title} $1.$2-$3</a>`);
		newHtml = newHtml.replace(regex2,
			`<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$1'
				data-lineFrom='$2'
			>${workName.title} $1.$2</a>`);
	});

	workNamesPeriod.forEach((workName) => {
		// regex for range with dash (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex1 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(\\d+)-(\\d+)(?!.*&quot;)`, 'g');

		// regex for no range (and lookahead to ensure range isn't captured) (lookahead to ignore if surrounded by &quot; - required for comment cross reference)
		regex2 = new RegExp(`([^\\w+])${workName.title}.(\\s*)(\\d+).(?!\\d+-\\d+)(\\d+)(?!.*&quot;)`, 'g');
		newHtml = newHtml.replace(regex1,
			`$1<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$3'
				data-lineFrom='$4'
				data-lineTo='$5'
			>${workName.title}.$2$3.$4-$5</a>`);
		newHtml = newHtml.replace(regex2,
			`$1<a
				class='has-lemma-reference'
				data-work=${workName.slug}
				data-subwork='$3'
				data-lineFrom='$4'
			>${workName.title}.$2$3.$4</a>`);
	});

	return { __html: newHtml };
};

const KeywordCommentList = (props) => {

	if (props.keywordComments) {
		return (
			<div className="comment-outer has-discussion">
				{props.keywordComments.map((comment, i) => {
					const selectedRevision = comment.revisions.pop();
					const updated = selectedRevision.updated;
					const format = 'D MMMM YYYY';

					return (
						<article
							key={comment._id}
							className="comment commentary-comment paper-shadow "
						>

							<div className="comment-upper">
								<div className="comment-upper-left">
									<h2 className="comment-title" style={{margin: 0, padding: 0}}><a href={`/commentary?_id=${comment._id}`}>{selectedRevision.title}</a></h2>
								</div>

								<div className="comment-upper-right">
									{comment.commenters.map((commenter, i) => {
										const commenterRecord = Commenters.findOne({
											slug: commenter.slug,
										});
										return (
											<div
												key={i}
												className="comment-author"
											>
												<div className="comment-author-text">
													<a href={`/commenters/${commenterRecord.slug}`}>
														<span className="comment-author-name" style={{margin: 0, textAlign: 'right'}}>{commenterRecord.name}</span>
													</a>
													<span className="comment-date" style={{margin: 0, textAlign: 'right'}}>
														{moment(updated).format(format)}
													</span>
												</div>
												<div className="comment-author-image-wrap paper-shadow">
													<a href={`/commenters/${commenterRecord.slug}`}>
														<AvatarIcon
															avatar={
																(commenterRecord && 'avatar' in commenterRecord) ?
																commenterRecord.avatar.src
																: null
															}
														/>
													</a>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<div className="comment-lower">
								<div
									className="comment-body"
									dangerouslySetInnerHTML={createRevisionMarkup(selectedRevision.text)}
								/>
							</div>
						</article>
					);
				})}
			</div>);
	}
	return null;
};
KeywordCommentList.propTypes = {
	keywordComments: React.PropTypes.array,
};

export default KeywordCommentList;
