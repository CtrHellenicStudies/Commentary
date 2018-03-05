import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PaginationPage = props => (
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
			{props.page}
		</span>
	</Link>
);


export default withRouter(PaginationPage);
