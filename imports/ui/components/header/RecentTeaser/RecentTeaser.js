import React from 'react';
import Utils from '/imports/lib/utils';

class RecentTeaser extends React.Component {
	static propTypes = {
		recentItem: React.PropTypes.object.isRequired,
	}

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

export default RecentTeaser;
