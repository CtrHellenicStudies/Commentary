import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WorkVisualization from '../../../works/components/WorkVisualization/WorkVizualization';


class CommenterWorkVisualization extends Component {

	constructor(props) {
		super(props);


		this.toggleVisibleWork = this.toggleVisibleWork.bind(this);
	}

	toggleVisibleWork(workSlug) {
		this.props.toggleVisibleWork(workSlug);
		this.workVisualization.close();
	}

	render() {
		const { work, commenterSlug, isTest } = this.props;

		return (
			<div className={`commenter-work-visualization commenter-work-visualization--${work.slug}`}>
				<i
					onClick={this.toggleVisibleWork}
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
	}
}

CommenterWorkVisualization.propTypes = {
	work: PropTypes.object.isRequired,
	toggleVisibleWork: PropTypes.func.isRequired,
	commenterSlug: PropTypes.string.isRequired,
	isTest: PropTypes.bool,
};

export default CommenterWorkVisualization;
