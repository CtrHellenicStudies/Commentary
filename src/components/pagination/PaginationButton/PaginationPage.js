import React from 'react';
import { connect } from 'react-redux';

import { updatePage } from '../../../actions/pagination';

const PaginationPage = props => (
	<button
		type="button"
		onClick={props.updatePage.bind(this, props.page)}
	>
		<span>
			{props.page}
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
)(PaginationPage);
