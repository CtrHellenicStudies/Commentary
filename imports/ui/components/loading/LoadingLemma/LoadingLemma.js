import React from 'react';
import PropTypes from 'prop-types';


const LoadingLemma = ({ ready }) => {
	if (!ready) {
		return (
			<div className="lemma-loading">
				<div className="lemma-loading-top" />
				<div className="lemma-loading-bottom" />
			</div>
		);
	}
	return null;
};

LoadingLemma.propTypes = {
	ready: PropTypes.bool,
};

export default LoadingLemma;
