/**
 * Get the comment group id from each comment
 */

const getCommentGroupId = (commentGroup) => {
	let id = '';
	commentGroup.comments.forEach((comment) => {
		id += `-${comment._id}`;
	});
	return id.slice(1);
};


export default getCommentGroupId;
