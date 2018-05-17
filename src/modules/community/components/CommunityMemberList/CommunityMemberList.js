import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

// graphql
import { usersQuery } from '../../../users/graphql/queries/users';
import CommunityMemberTeaser from '../CommunityMemberTeaser/CommunityMemberTeaser';

import './CommunityMemberList.css';


class CommunityMemberList extends Component {
	render() {
		const users = this.props.usersQuery.users;

		return (
			<div className="communityMemberList">
				{users.map((user, i) => (
					<CommunityMemberTeaser
						key={i}
						user={user}
					/>
				))}
			</div>
		);
	}
}
CommunityMemberList.propTypes = {
	usersQuery: PropTypes.object,
};
export default compose(usersQuery)(CommunityMemberList);
