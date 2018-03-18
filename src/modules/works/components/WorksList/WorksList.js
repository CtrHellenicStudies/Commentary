import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

// components
import WorkVisualization from '../WorkVisualization/WorkVizualization';

// graphql

class WorksList extends Component {

	constructor(props) {
		super(props);

		this.works = [];
	}

	renderWorks() {
		const { works } = this.state;

		if (!works) {
			return null;
		}

		return works.map((work, i) => (
			<WorkVisualization
				key={i}
				work={work}
			/>
		));
	}

	render() {
		return (
			<div>
				{this.renderWorks()}
			</div>
		);
	}

}

export default WorksList;