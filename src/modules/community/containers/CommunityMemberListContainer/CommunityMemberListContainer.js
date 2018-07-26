import React from 'react';
import { compose } from 'react-apollo';

// graphql
import usersQuery from '../../../users/graphql/queries/users';

// component
import CommunityMemberList from '../../components/CommunityMemberList';


const CommunityMemberListContainer = props => {
	let users = [];

	if (
		props.usersQuery
    && props.usersQuery.users
	) {
		users = props.usersQuery.users;
	}

	return (
		<CommunityMemberList
			users={users}
		/>
	);
};


export default compose(
	usersQuery,
)(CommunityMemberListContainer);
