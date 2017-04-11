const KeywordCommentList = (props) => {

	console.log('props', props)

	if (props.keywordComments) {
		return (
			<div>
				{props.keywordComments.map((comment, i) => (
					<article
						className="comment commentary-comment paper-shadow "
					>
						TEST
					</article>
				))}
			</div>);
	}
	return null;
};
KeywordCommentList.propTypes = {
	keywordComments: React.PropTypes.array,
};

export default KeywordCommentList;
