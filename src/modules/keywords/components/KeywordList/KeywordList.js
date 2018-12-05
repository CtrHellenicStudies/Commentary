import React from 'react';
import PropTypes from 'prop-types';

// components
import KeywordTeaser from '../KeywordTeaser';

const KeywordList = ({ keywords }) => (
	<div className="keywords-list">
		{keywords.map((keyword, i) => (
			<KeywordTeaser
				key={i}
				keyword={keyword}
			/>
		))}
	</div>
);

KeywordList.propTypes = {
	keywords: PropTypes.array,
};

KeywordList.defaultProps = {
	keywords: [],
};

export default KeywordList;
