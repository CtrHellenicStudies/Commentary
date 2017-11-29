import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import TextNodes from '/imports/models/textNodes';

// graphql
import { textNodesQuery } from '/imports/graphql/methods/textNodes';

const UserBookmarksList = React.createClass({
	propTypes: {
		bookmarkedText: PropTypes.array,
	},

	render() {
		const { bookmarkedText } = this.props;
		const styles = {
			listItem: {
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				font: 'normal',
			},
			list: {
				marginTop: 0,
			},
		};

		if (!bookmarkedText) {
			return null;
		}

		return (
			<div className="collection with-header" style={styles.list}>
				<div className="collection-header"> <h3>Bookmarks</h3></div>
				{this.props.bookmarkedText.map((text, i) => (
					<BookmarkedTextNode
						key={i}
						isOdd={i % 2}
						text={text}
					/>
					))}
			</div>
		);
	},
});

const UserBookmarksListContainer = createContainer(() => {
	let bookmarkedText = [];
	const handleBookmark = Meteor.subscribe('bookmark');
	const bookmarkList = Meteor.users.findOne({}, { fields: { bookmarks: 1 } });

	const bookmarks = [];

	if (bookmarkList && bookmarkList.bookmarks && bookmarkList.bookmarks.length) {
		bookmarkList.bookmarks.forEach((bookmark) => {
			bookmarks.push(new Meteor.Collection.ObjectID(bookmark));
		});


		if (!props.textNodesQuery.loading) {
			bookmarkedText = props.textNodesQuery.loading ? [] :
			props.textNodesQuery.textNodes.filter(x => bookmarks.find(y => y === x._id) !== undefined);
		}
	}

	return {
		bookmarkedText,
	};
}, UserBookmarksList);

export default compose(textNodesQuery)(UserBookmarksListContainer);
