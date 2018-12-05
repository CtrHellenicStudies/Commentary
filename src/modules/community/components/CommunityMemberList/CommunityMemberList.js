import React from 'react';
import PropTypes from 'prop-types';

// components
import CommunityMemberTeaser from '../CommunityMemberTeaser';

import './CommunityMemberList.css';


const CommunityMemberList = ({ users }) => (
	<div className="communityMemberList">
		{users.map((user, i) => (
			<CommunityMemberTeaser
				key={i}
				user={user}
			/>
		))}
	</div>
);

CommunityMemberList.propTypes = {
	users: PropTypes.array,
};

export default CommunityMemberList;
