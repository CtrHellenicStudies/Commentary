import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PaginationLast = props => (
	<Link
		to={{
			pathname: '/',
			query: {
				...props.location.query,
				page: props.page,
			},
		}}
	>
		<span>
			Last
		</span>
		<i className="mdi mdi-chevron-right" />
	</Link>
);


export default withRouter(PaginationLast);
