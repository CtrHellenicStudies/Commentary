import React, { Component } from 'react';

// components
import CommunityMemberList from './CommunityMemberList';


class CommunityDirectory extends Component {

	render() {

		return (
			<div className="communityDirectory">
				<h3>Community Directory</h3>
				<CommunityMemberList />
			</div>

		);
	}
}


export default CommunityDirectory;
