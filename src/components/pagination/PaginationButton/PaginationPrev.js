import React from 'react';
import { connect } from 'react-redux';

import { updatePage } from '../../../actions/pagination';

const PaginationPrev = props => (
	<button
		type="button"
		onClick={props.updatePage.bind(this, props.activePage - 1)}
	>
		<i className="mdi mdi-chevron-left" />
		<span>
			Previous
		</span>
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
)(PaginationPrev);
