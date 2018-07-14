import React from 'react';

// components
import CommunityMemberList from '../CommunityMemberList';

import './CommunityDirectory.css';


class CommunityDirectory extends React.Component {

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
