import React from 'react';
import { connect } from 'react-redux';

import { updatePage } from '../../../actions/pagination';

const PaginationNext = ({ updatePage, location, activePage }) => (
	<button
		type="button"
		onClick={updatePage.bind(this, activePage + 1)}
	>
		<span>
			Next
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
)(PaginationNext);
