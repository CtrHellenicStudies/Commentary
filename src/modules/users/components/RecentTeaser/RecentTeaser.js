import React from 'react';
import PropTypes from 'prop-types';

import Utils from '../../../../lib/utils';


import './RecentTeaser.css';


class RecentTeaser extends React.Component {

	render() {
		const { recentItem } = this.props;

		return (
			<a
				className="recentTeaser"
				href={recentItem.link}
			>
				<span className="recentTeaserTitle">
					{recentItem.author}, {Utils.trunc(recentItem.title, 30)}
				</span>
				<span className="recentTeaserChapter">
					{Utils.trunc(recentItem.subtitle, 30)}
				</span>
			</a>
		);
	}
}
RecentTeaser.propTypes = {
	recentItem: PropTypes.object.isRequired,
};
export default RecentTeaser;
