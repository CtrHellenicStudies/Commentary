import React, { Component } from 'react';

// components
import CommunityMemberList from '../CommunityMemberList/CommunityMemberList';

import './CommunityDirectory.css';


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
