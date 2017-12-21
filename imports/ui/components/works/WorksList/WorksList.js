import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// components
import WorkVisualization from '/imports/ui/components/works/WorkVisualization';

// graphql
import { worksQuery } from '/imports/graphql/methods/works';

// lib
import muiTheme from '/imports/lib/muiTheme';


class WorksList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			works: []
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			works: nextProps.worksQuery.loading ? [] : nextProps.worksQuery.worksAhcip
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
