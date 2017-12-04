import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';

// graphql
import { worksQuery } from '/imports/graphql/methods/works';

// components
import WorkOption from './WorkOption';
import { Session } from 'inspector';


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
	const tenantId = Session.get('tenantId');
	if (tenantId) {
		props.worksQuery.refetch({
			tenantId: tenantId
		});
	}
	const works = props.worksQuery.loading ? [] : props.worksQuery.works;

	return {
		works,
	};
}, WorkInput);

export default compose(worksQuery)(WorkInputContainer);
