import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import Masonry from 'react-masonry-component/lib';
import ReferenceWorks from '/imports/api/collections/referenceWorks';

const ReferenceWorksList = React.createClass({

	propTypes: {
		commenterId: React.PropTypes.string,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		// SUBSCRIPTIONS:
		const query = {};
		if (this.props.commenterId) {
			query.authors = this.props.commenterId;
			Meteor.subscribe('referenceWorks.commenterId', this.props.commenterId, Session.get('tenantId'));
		} else {
			Meteor.subscribe('referenceWorks', Session.get('tenantId'));
		}

		// FETCH DATA:
		const referenceWorks = ReferenceWorks.find(query, { sort: { title: 1 } }).fetch();

		return {
			referenceWorks,
		};
	},

	renderReferenceWorks() {
		return this.data.referenceWorks.map((referenceWork, i) => (
			<ReferenceWorkTeaser
				key={i}
				referenceWork={referenceWork}
			/>
		));
	},

	render() {
		const masonryOptions = {
			isFitWidth: true,
			transitionDuration: 300,
		};
		return (
			<div>
				{this.data.referenceWorks.length ?
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

export default ReferenceWorksList;
