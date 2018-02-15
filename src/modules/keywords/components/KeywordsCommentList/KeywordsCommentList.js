import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { compose } from 'react-apollo';

// components
import AvatarIcon from '../../../profile/components/AvatarIcon/AvatarIcon';

// lib
import createRevisionMarkup from '../../../../lib/createRevisionMarkup';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/commentersQuery';


const KeywordCommentList = (props) => {

	const { keywordComments } = props;

	if (!keywordComments || !keywordComments.length) {
		return (
			<div className="comment-outer has-discussion">
				<div className="no-results">
					This tag has no comments associated with it yet.
				</div>
			</div>
		);
	}

	return (
		<div className="comment-outer has-discussion">
			{props.keywordComments.map((comment, i) => {
				const selectedRevision = comment.revisions[comment.revisions.length - 1];
				const updated = selectedRevision.updated;
				const format = 'D MMMM YYYY';

				return (
					<article
						key={comment._id}
						className="comment commentary-comment paper-shadow "
					>

						<div className="comment-upper">
							<div className="comment-upper-left">
								<h2 className="comment-title" style={{margin: 0, padding: 0}}><Link to={`/commentary?_id=${comment._id}`}>{selectedRevision.title}</Link></h2>
							</div>

							<div className="comment-upper-right">
								{comment.commenters.map((commenter, _i) => {
									const commenterRecord = props.commentersQuery.loading ? {} : props.commentersQuery.commenters.find(x =>
										x.slug === commenter.slug);

									if (!commenterRecord) {
										return null;
									}

									return (
										<div
											key={_i}
											className="comment-author"
										>
											<div className="comment-author-text">
												<Link to={`/commenters/${commenterRecord.slug}`}>
													<span className="comment-author-name" style={{margin: 0, textAlign: 'right'}}>{commenterRecord.name}</span>
												</Link>
												<span className="comment-date" style={{margin: 0, textAlign: 'right'}}>
													{moment(updated).format(format)}
												</span>
											</div>
											<div className="comment-author-image-wrap paper-shadow">
												<Link to={`/commenters/${commenterRecord.slug}`}>
													<AvatarIcon
														avatar={
															(commenterRecord && commenterRecord.avatar) ?
															commenterRecord.avatar.src
															: null
														}
													/>
												</Link>
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
		</div>
	);
};

KeywordCommentList.propTypes = {
	keywordComments: PropTypes.array,
};

export default compose(
	commentersQuery
)(KeywordCommentList);
