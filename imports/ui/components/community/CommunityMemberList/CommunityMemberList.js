import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import CommunityMemberTeaser from '../CommunityMemberTeaser';

class CommunityMemberList extends React.Component {
	static propTypes = {
		users: React.PropTypes.array,
	}

	render() {
		return (
			<div className="CommunityMemberList">
				<CommunityMemberTeaser
					user={user}
				/>
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
