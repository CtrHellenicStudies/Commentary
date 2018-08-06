const getCommentersFromFormInput = (commenterData, commenters) => {
	const commentersList = [];

	commenterData.forEach(commenter => {
		const currentCommenter = commenters.find(x => x._id === commenter.value);
		commentersList.push(currentCommenter);
	});

	return commentersList;
};

export default getCommentersFromFormInput;
