import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { createContainer } from 'meteor/react-meteor-data';
import { Card, CardHeader } from 'material-ui/Card';

import BookmarksForm from '/imports/ui/components/user/ProfilePage/Bookmarks/BookmarksForm';

class Bookmarks extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toggleBookmarksForm: false
		};

		this.toggleBookmarksForm = this.toggleBookmarksForm.bind(this);
	}

	static propTypes = {
		subscriptions: React.PropTypes.object
	}

	toggleBookmarksForm() {
		const {toggleBookmarksForm} = this.state;
		this.setState({
			toggleBookmarksForm: !toggleBookmarksForm
		});
	}

	render() {
		const { toggleBookmarksForm } = this.state;
		const { subscriptions } = this.props;

		return (
			<div>
				<h2>Your Bookmarks</h2>
				{subscriptions.bookmarks ?
					<div>
						{subscriptions.bookmarks.map(bookmark => (
							<Card key={bookmark._id}>
								<a>
									<CardHeader
										title={`${bookmark.work.title} ${bookmark.subwork}, lines ${bookmark.lineFrom} to ${bookmark.lineTo}`}
										subtitle={`Subscribed on ${bookmark.subscribedOn}`}
									/>
								</a>
							</Card>
					))}
					</div>
					:
					<h3>You have no notifications.</h3>
				}
				{toggleBookmarksForm ?
					<BookmarksForm
						toggleBookmarksForm={this.toggleBookmarksForm}
					/>
					:
					<div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
						<FlatButton
							label="Add Bookmark"
							onTouchTap={this.toggleBookmarksForm}
						/>
					</div>
				}
			</div>
		);
	}
}

const BookmarksContainer = createContainer(() => {
	const subscriptions = Meteor.user().subscriptions;
	return {
		subscriptions
	};
}, Bookmarks);

export default BookmarksContainer;
