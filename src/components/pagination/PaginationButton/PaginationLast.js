import React from 'react';
import { connect } from 'react-redux';

import { updatePage } from '../../../actions/pagination';

const PaginationLast = props => (
	<button
		type="button"
		onClick={props.updatePage.bind(this, props.page)}
	>
		<span>
			Last
		</span>
		<i className="mdi mdi-chevron-right" />
	</button>
);

const mapStateToProps = state => ({
	activePage: state.pagination.page,
});

const mapDispatchToProps = dispatch => ({
	updatePage: (page) => {
		dispatch(updatePage(page));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PaginationLast);
