import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { withRouter } from 'react-router';

const getLabel = (keyword) => {
	let label = keyword.title || keyword.wordpressId;
	if (keyword.isMentionedInLemma) label = `[ ${label} ]`;
	return label;
};

const goToSearchTerm = keyword => {

};

const CommentKeywordsContainer = props => (
	<div className="comment-keywords-container">
		{props.keywords.map((keyword, i) => (
			<RaisedButton
				key={`${i}-${keyword._id}`}
				className="comment-keyword paper-shadow"
				onClick={goToSearchTerm(keyword)}
				data-id={keyword._id}
				label={getLabel(keyword)}
			/>
		))}
	</div>
);

CommentKeywordsContainer.propTypes = {
	keywords: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string,
		wordpressId: PropTypes.number,
	})).isRequired,
};

export default withRouter(CommentKeywordsContainer);
