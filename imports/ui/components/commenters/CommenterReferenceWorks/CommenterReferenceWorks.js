import React from 'react';

import ReferenceWorksList from '/imports/ui/components/referenceWorks/ReferenceWorksList';

const CommenterReferenceWorks = ({ commenter }) => (
	<div
		className="commenter-reference-works"
	>
		<div className="commenter-reference-works-title">
			<h2>
				Reference Works
			</h2>
		</div>
		<ReferenceWorksList
			commenterId={commenter._id}
		/>
	</div>
);
CommenterReferenceWorks.propTypes = {
	commenter: React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
	}).isRequired,
};


export default CommenterReferenceWorks;
