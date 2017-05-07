import React from 'react';

// api
import Commenters from '/imports/api/collections/commenters';

// components
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

// lib
import createRevisionMarkup from '/imports/lib/createRevisionMarkup';

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
									{comment.commenters.map((commenter, _i) => {
										const commenterRecord = Commenters.findOne({
											slug: commenter.slug,
										});

										if (!commenterRecord) {
											return null;
										}

										return (
											<div
												key={_i}
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
