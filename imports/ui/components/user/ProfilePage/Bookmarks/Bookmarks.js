import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import BookmarksForm from '/imports/ui/components/user/ProfilePage/Bookmarks/BookmarksForm';

class Bookmarks extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toggleBookmarksForm: false
		};

		this.toggleBookmarksForm = this.toggleBookmarksForm.bind(this);
	}

	toggleBookmarksForm() {
		const {toggleBookmarksForm} = this.state;
		this.setState({
			toggleBookmarksForm: !toggleBookmarksForm
		});
	}

	render() {
		const {toggleBookmarksForm} = this.state;
		return (
			<div>
				<hr className="user-divider" />
				<h2>Your Bookmarks</h2>
				<h3>You have no bookmarks.</h3>
				<div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
					<FlatButton
						label={toggleBookmarksForm ? 'Close Form' : 'Add Bookmark'}
						onTouchTap={this.toggleBookmarksForm}
					/>
				</div>
				{toggleBookmarksForm ?
					<BookmarksForm />
					:
					''
				}
			</div>
		);
	}
}

export default Bookmarks;
