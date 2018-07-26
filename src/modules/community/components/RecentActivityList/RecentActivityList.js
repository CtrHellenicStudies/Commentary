import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

// components
import RecentActivityTeaser from '../RecentActivityTeaser';

import './RecentActivityList.css';


const RecentActivityList = ({ comments, loadMore }) => (
	<div className="recentActivityList">
		{comments.map((comment, i) => (
			<RecentActivityTeaser
				key={i}
				comment={comment}
			/>
		))}
		<div className="loadMore">
			<RaisedButton
				onClick={loadMore}
				label="Load More"
				primary
			/>
		</div>
	</div>
);

export default RecentActivityList;
