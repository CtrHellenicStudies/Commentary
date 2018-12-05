import React from 'react';

// components
import CommunityMemberListContainer from '../../containers/CommunityMemberListContainer';

import './CommunityDirectory.css';


class CommunityDirectory extends React.Component {

	render() {

		return (
			<div className="communityDirectory">
				<h3>Community Directory</h3>
				<CommunityMemberListContainer />
			</div>

		);
	}
}


export default CommunityDirectory;
