import React from 'react';
import PropTypes from 'prop-types';

const LineNumbering = ({ location }) => {
	const n = location[location.length - 1];

	return (
		<div className="lemma-meta">
			<span
				className={`lemma-textNode-n ${
					(n % 5 === 0 || n === 1) ? 'lemma-textNode-n--displayed' : ''
				}`}
			>
				{n}
			</span>
		</div>
	);
}

LineNumbering.propTypes = {
	location: PropTypes.array.isRequired,
};

export default LineNumbering;
