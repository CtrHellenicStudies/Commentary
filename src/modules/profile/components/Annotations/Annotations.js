import React from 'react';

class Annotations extends React.Component {
	render() {
		return (
			<div>
				<h2>Your Annotations</h2>
				<hr className="user-divider" />
				<div className="user-discussion-comments" />
				<p className="no-results">
					You have not created any annotations.
				</p>
			</div>
		);
	}
}

export default Annotations;
