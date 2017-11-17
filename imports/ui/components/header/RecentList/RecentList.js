import React from 'react';
import PropTypes from 'prop-types';
import RecentTeaser from '../RecentTeaser';

class RecentList extends React.Component {
	static propTypes = {
		recentItems: PropTypes.array.isRequired,
	}

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

export default RecentList;
