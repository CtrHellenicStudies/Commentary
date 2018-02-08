import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

// components
import WorkVisualization from '../WorkVisualization/WorkVizualization';

// graphql
import { subworksQuery } from '../../../../graphql/methods/works';

class WorksList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			works: props.subworksQuery.loading ? [] : props.subworksQuery.worksAhcip
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			works: nextProps.subworksQuery.loading ? [] : nextProps.subworksQuery.worksAhcip
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
	subworksQuery: PropTypes.object,
};

export default compose(subworksQuery)(WorksList);
