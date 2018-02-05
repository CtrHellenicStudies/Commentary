import React, { Component } from 'react';
import PropTypes from 'prop-types';

// components
import RecentTeaser from '../RecentTeaser';


class RecentList extends Component {

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
