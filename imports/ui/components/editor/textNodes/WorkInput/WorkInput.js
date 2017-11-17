import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';

// models
import Works from '/imports/models/works';

// components
import WorkOption from './WorkOption';


class WorkInput extends React.Component {

	render() {
		const { works } = this.props;

		return (
			<div className="work-input">
				<div className="works-options">
					{works.map(work => (
						<WorkOption {...work} />
					))}
				</div>
			</div>
		);
	}
}

WorkInput.propTypes = {
	works: PropTypes.array,
};

const WorkInputContainer = createContainer(props => {
	Meteor.subscribe('works', Session.get('tenantId'));
	const works = Works.find().fetch();

	return {
		works,
	};
}, WorkInput);

export default WorkInputContainer;
