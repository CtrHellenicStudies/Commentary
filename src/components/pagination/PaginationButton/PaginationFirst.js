import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PaginationFirst = props => (
	<Link
		to={{
			pathname: '/',
			query: {
				...props.location.query,
				page: props.page,
			},
		}}
	>
		<i className="mdi mdi-chevron-left" />
		<span>
			First
		</span>
	</Link>
);


export default withRouter(PaginationFirst);
