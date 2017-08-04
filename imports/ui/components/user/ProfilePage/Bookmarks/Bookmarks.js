import React from 'react';

class Bookmarks extends React.Component {
	render() {
		return (
			<div>
				<h2>Your Bookmarks</h2>
				<hr className="user-divider" />
				<div className="user-discussion-comments" />
				<p className="no-results">
					You have not created any bookmarks.
				</p>
			</div>
		);
	}
}

export default Bookmarks;
