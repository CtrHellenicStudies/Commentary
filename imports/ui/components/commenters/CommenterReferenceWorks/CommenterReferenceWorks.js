import React from 'react';

import ReferenceWorksList from '/imports/ui/components/referenceWorks/ReferenceWorksList';

const CommenterReferenceWorks = React.createClass({

	propTypes: {
		commenter: React.PropTypes.object.isRequired,
	},

	render() {
		const { commenter } = this.props;
		if (!commenter) {
			return null;
		}
		
		return (
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
	},

});


export default CommenterReferenceWorks;
