const getKeywordsFromCommentFormData = tagsValue => {
	const keywords = [];

	tagsValue.forEach((tag) => {
		const keywordCopy = {};
		for (const [key, value] of Object.entries(tag.keyword)) {
			if (key === 'isMetionedInLemma') {
				keywordCopy[key] = tag.isMentionedInLemma;
			} else if (key !== '__typename') {
				keywordCopy[key] = value;
			}
		}

		keywords.push(keywordCopy);
	});

	return keywords;
};

const getReferenceWorksFromCommentFormData = referenceWorksValue => {
	const referenceWorks = [];
	referenceWorksValue.forEach(referenceWork => {
		referenceWorks.push({
			_id: referenceWork.value,
			title: referenceWork.label,
			slug: referenceWork.slug,
		});
	});

	return referenceWorks;
}

const getCommentersFromCommentFormData = commentersValue => {
	const commenters = [];
	commentersValue.forEach(commenter => {
		commenters.push({
			_id: commenter.value,
			name: commenter.label,
			slug: commenter.slug,
		});
	});

	return commenters;
}


const getSelectOptionsFromCommentFormData = formData => {
	const keywords = getKeywordsFromCommentFormData(formData.tagsValue);
	const referenceWorks = getReferenceWorksFromCommentFormData(formData.referenceWorksValue);
	const commenters = getCommentersFromCommentFormData(formData.commentersValue)


	return {
		keywords,
		referenceWorks,
		commenters,
	};
}

export default getSelectOptionsFromCommentFormData;
