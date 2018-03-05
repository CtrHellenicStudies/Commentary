import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PaginationNext = ({ location, page }) => (
	<Link
		to={{
			pathname: '/',
			query: {
				...location.query,
				page,
			},
		}}
	>
		<span>
			Next
		</span>
		<i className="mdi mdi-chevron-right" />
	</Link>
);


export default withRouter(PaginationNext);
