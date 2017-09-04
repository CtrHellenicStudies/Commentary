export const sortRevisions = (revisions) => {
	return _.sortBy(revisions, 'created');
};

export const getDateRevision = (revision, comment) => {
	if (revision.originalDate) {
		return revision.originalDate;
	} else if (revision.updated) {
		return revision.updated;
	} else if (revision.created) {
		return revision.created;
	} else if (comment) {
		if (comment.updated) {
			return comment.updated;
		} else {
			return comment.created;
		}
	}

	console.error("No date information available for revision", revision._id);
	return null;
};
