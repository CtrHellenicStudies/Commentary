import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

// components
import WorkVisualization from './WorkVizualization';

// graphql
import { worksQuery } from '../../graphql/methods/works';

class WorksList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			works: []
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			works: nextProps.worksQuery.loading ? [] : nextProps.worksQuery.collection.textGroup.works
		});
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

WorksList.propTypes = {
	worksQuery: PropTypes.object,
};

export default compose(worksQuery)(WorksList);
