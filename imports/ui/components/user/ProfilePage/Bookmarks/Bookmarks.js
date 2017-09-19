import React from 'react';
import { Meteor } from 'meteor/meteor';
import FlatButton from 'material-ui/FlatButton';
import { createContainer } from 'meteor/react-meteor-data';
import { Card, CardHeader } from 'material-ui/Card';

import BookmarksForm from '/imports/ui/components/user/ProfilePage/Bookmarks/BookmarksForm';

class Bookmarks extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toggleBookmarksForm: false,
			bookmarks: []
		};

		this.toggleBookmarksForm = this.toggleBookmarksForm.bind(this);
		this.removeBookmark = this.removeBookmark.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.subscriptions !== nextProps.subscriptions) {
			this.setState({
				bookmarks: nextProps.subscriptions.bookmarks
			});
		}
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

	removeBookmark(bookmark) {
		const { bookmarks } = this.state;

		const bookmarkID = bookmark._id;

		this.setState({
			bookmarks: bookmarks.filter(bookmarkToRemove => bookmarkToRemove._id !== bookmarkID)
		});

		Meteor.users.update({_id: Meteor.userId()}, {
			$pull: {
				'subscriptions.bookmarks': {_id: bookmarkID}
			}
		});

		console.log('bookmark in collection: ', this.props.subscriptions.bookmarks);
		console.log('bookmarks after update: ', bookmarks);

	}

	render() {
		const { toggleBookmarksForm, bookmarks } = this.state;
		const { subscriptions } = this.props;

		return (
			<div>
				<h2>Your Bookmarks</h2>
				{bookmarks ?
					<div>
						{bookmarks.map(bookmark => (
							<Card key={bookmark._id}>
								<a>
									<CardHeader
										title={`${bookmark.work.title} ${bookmark.subwork}, lines ${bookmark.lineFrom} to ${bookmark.lineTo}`}
										subtitle={`Subscribed on ${moment(bookmark.subscribedOn).format('D/M/YYYY')}`}
									/>
								</a>
								<FlatButton
									label="Remove Bookmark"
									onTouchTap={() => this.removeBookmark(bookmark)}
								/>
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
