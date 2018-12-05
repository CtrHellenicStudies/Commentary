import React from 'react';
import PropTypes from 'prop-types';
import _s from 'underscore.string';


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
					{recentItem.author}, {_s.truncate(recentItem.title, 30)}
				</span>
				<span className="recentTeaserChapter">
					{_s.truncate(recentItem.subtitle, 30)}
				</span>
			</a>
		);
	}
}
RecentTeaser.propTypes = {
	recentItem: PropTypes.object.isRequired,
};
export default RecentTeaser;
