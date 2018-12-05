import React from 'react';
import PropTypes from 'prop-types';

// components
import RecentTeaser from '../RecentTeaser';


import './RecentList.css';

class RecentList extends React.Component {

	render() {
		const { recentItems } = this.props;

		return (
			<div className="recentList">
				{recentItems.map((recentItem, i) => (
					<RecentTeaser
						key={i}
						recentItem={recentItem}
					/>
				))}
			</div>
		);
	}
}
RecentList.propTypes = {
	recentItems: PropTypes.array.isRequired,
};
export default RecentList;
