import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';

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

const mapStateToProps = (state, props) => ({
	selectedWork: state.textNodes.work,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default WorkOption;
