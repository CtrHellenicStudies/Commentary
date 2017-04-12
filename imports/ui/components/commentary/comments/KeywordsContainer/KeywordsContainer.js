import RaisedButton from 'material-ui/RaisedButton';

import s from './KeywordsContainer.css';

const KeywordsContainer = props => (
	<div className={s['comment-keywords-container']}>
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
KeywordsContainer.propTypes = {
	keywords: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string,
		wordpressId: React.PropTypes.number,
	})).isRequired,
	keywordOnClick: React.PropTypes.func.isRequired,
};

export default KeywordsContainer;
