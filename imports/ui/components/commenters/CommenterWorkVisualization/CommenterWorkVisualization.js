import React from 'react';

import WorkVisualization from '/imports/ui/components/works/WorkVisualization';


const CommenterWorkVisualization = React.createClass({

	propTypes: {
		work: React.PropTypes.object.isRequired,
		toggleVisibleWork: React.PropTypes.func.isRequired,
		commenterSlug: React.PropTypes.string.isRequired,
		isTest: React.PropTypes.bool,
	},

	toggleVisibleWork(workSlug) {
		this.props.toggleVisibleWork(workSlug);
		this.workVisualization.close();
	},

	render() {
		const { work, commenterSlug, isTest } = this.props;

		return (
			<div className={`commenter-work-visualization commenter-work-visualization--${work.slug}`}>
				<i
					onClick={this.toggleVisibleWork.bind(null, work.slug)}
					className="close-visualization mdi mdi-close"
				/>
				{!isTest ?
					<WorkVisualization
						ref={(component) => { this.workVisualization = component; }}
						work={work}
						commenterSlug={commenterSlug}
					/>
				: ''}
			</div>
		);
	},
});


export default CommenterWorkVisualization;
