import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import CommunityMemberTeaser from '../CommunityMemberTeaser';

class CommunityMemberList extends React.Component {
	static propTypes = {
		users: React.PropTypes.array,
	}

	render() {
		const { users } = this.props;

		return (
			<div className="CommunityMemberList">
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
	const handle = Meteor.subscribe('communityDirectory');
	const users = Meteor.users.find().fetch();

	return {
		users: users || [],
		ready: handle.ready(),
	};
}, CommunityMemberList);

export default CommunityMemberListContainer;
