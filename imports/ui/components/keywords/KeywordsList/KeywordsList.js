import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

// api
import Keywords from '/imports/api/collections/keywords';

// components
import KeywordTeaser from '/imports/ui/components/keywords/KeywordTeaser';

const KeywordsList = React.createClass({

	propTypes: {
		type: React.PropTypes.string.isRequired,
		limit: React.PropTypes.number,
		keywords: React.PropTypes.array,
	},

	renderKeywords() {
		return this.props.keywords.map((keyword, i) => (
			<KeywordTeaser
				key={i}
				keyword={keyword}
			/>
		));
	},

	render() {
		return (
			<div className="keywords-list">
				{this.renderKeywords()}
			</div>
		);
	},

});

export default createContainer(({ type, limit }) => {
	const skip = 0;
	let _limit = 100;
	if (limit) {
		_limit = limit;
	}

	const query = {
		type,
		tenantId: Session.get('tenantId'),
		count: { $gte: 1 },
	};

	switch (type) {
	case 'word':
		Meteor.subscribe('keywords.keywords', query, skip, _limit);
		break;
	case 'idea':
		Meteor.subscribe('keywords.keyideas', query, skip, _limit);
		break;
	default:
		break;
	}

	const keywords = Keywords.find(query, { limit: _limit }).fetch();

	return {
		keywords,
	};
}, KeywordsList);
