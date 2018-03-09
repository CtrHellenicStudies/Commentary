import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import CommunityMemberTeaser from '../CommunityMemberTeaser';

class CommunityMemberList extends React.Component {
	static propTypes = {
		users: PropTypes.array,
	}

	render() {
		const { users } = this.props;

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

const CommunityMemberListContainer = createContainer(() => {
	const handle = Meteor.subscribe('users.all');
	const users = Meteor.users.find({}, {
		sort: {
			'profile.name': 1,
			'emails.address': 1,
		}
	}).fetch();

	return {
		users: users || [],
		ready: handle.ready(),
	};
}, CommunityMemberList);

export default CommunityMemberListContainer;