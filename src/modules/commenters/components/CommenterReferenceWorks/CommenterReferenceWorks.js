import React from 'react';
import PropTypes from 'prop-types';

import ReferenceWorkList from '../../../referenceWorks/components/ReferenceWorkList';

import './CommenterReferenceWorks.css';


const CommenterReferenceWorks = ({ commenter }) => (
	<div
		className="commenter-reference-works"
	>
		<div className="commenter-reference-works-title">
			<h2>
				Reference Works
			</h2>
		</div>
		<ReferenceWorkList
			commenterId={commenter._id}
		/>
	</div>
);
CommenterReferenceWorks.propTypes = {
	commenter: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
};


export default CommenterReferenceWorks;
