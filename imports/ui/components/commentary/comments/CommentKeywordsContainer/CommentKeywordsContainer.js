import RaisedButton from 'material-ui/RaisedButton';

const CommentKeywordsContainer = props => (
	<div className="comment-keywords-container">
		{props.keywords.map(keyword => (
			<RaisedButton
				key={keyword._id}
				className="comment-keyword paper-shadow"
				onClick={props.keywordOnClick.bind(null, keyword)}
				data-id={keyword._id}
				label={(keyword.title || keyword.wordpressId)}
			/>
		))}
	</div>
);
CommentKeywordsContainer.propTypes = {
	keywords: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string,
		wordpressId: React.PropTypes.number,
	})).isRequired,
	keywordOnClick: React.PropTypes.func.isRequired,
};

export default CommentKeywordsContainer;
