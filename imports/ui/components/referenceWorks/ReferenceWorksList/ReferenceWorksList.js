import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import Masonry from 'react-masonry-component/lib';

// api
import ReferenceWorks from '/imports/api/collections/referenceWorks';

// components
import ReferenceWorkTeaser from '/imports/ui/components/referenceWorks/ReferenceWorkTeaser';

// lib
import Utils from '/imports/lib/utils';


const ReferenceWorksList = React.createClass({

	propTypes: {
		commenterId: React.PropTypes.string,
		referenceWorks: React.PropTypes.array,
	},

	renderReferenceWorks() {
		return this.props.referenceWorks.map((referenceWork, i) => (
			<ReferenceWorkTeaser
				key={i}
				referenceWork={referenceWork}
			/>
		));
	},

	render() {
		const { referenceWorks } = this.props;
		const masonryOptions = {
			isFitWidth: true,
			transitionDuration: 300,
		};

		if (!referenceWorks) {
			return null;
		}

		return (
			<div>
				{referenceWorks.length ?
					<Masonry
						options={masonryOptions}
						className="reference-works-list"
					>
						{this.renderReferenceWorks()}
					</Masonry>
					:
					<p className="no-results no-results-reference-works">No reference works found.</p>
				}
			</div>
		);
	},

});

const ReferenceWorksListContainer = createContainer(({ commenterId }) => {
	// SUBSCRIPTIONS:
	const query = {};
	if (commenterId) {
		query.authors = commenterId;
		Meteor.subscribe('referenceWorks.commenterId', commenterId, Session.get('tenantId'));
	} else {
		Meteor.subscribe('referenceWorks', Session.get('tenantId'));
	}

	// FETCH DATA:
	const referenceWorks = ReferenceWorks.find(query, { sort: { title: 1 } }).fetch();

	return {
		referenceWorks,
	};
}, ReferenceWorksList);

export default ReferenceWorksListContainer;
