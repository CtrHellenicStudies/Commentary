import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class WorkOption extends React.Component {

	render() {
		const { _id, title, actions } = this.props;

		return (
			<div
				className={`work-option ${selectedWork._id === _id ? 'work-option--selected' : ''}`}
				onClick={actions.selectWork.bind(this, _id)}
			>
				<h3>{title}</h3>
			</div>
		);
	}
}

WorkOption.propTypes = {
	_id: PropTypes.string,
	title: PropTypes.string,
	actions: PropTypes.array,
};

const mapStateToProps = (state, props) => ({
	selectedWork: state.textNodes.work,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default WorkOption;
