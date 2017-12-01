import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { compose } from 'react-apollo';

// models
import Keywords from '/imports/models/keywords';

// graphql
import { keywordsQuery } from '/imports/graphql/methods/keywords';

// components
import KeywordTeaser from '/imports/ui/components/keywords/KeywordTeaser';

class KeywordsList extends React.Component {

	renderKeywords() {
		const { keywords } = this.props;

		if (!keywords) {
			return null;
		}

		return keywords.map((keyword, i) => (
			<KeywordTeaser
				key={i}
				keyword={keyword}
			/>
		));
	}

	render() {
		return (
			<div className="keywords-list">
				{this.renderKeywords()}
			</div>
		);
	}
}

KeywordsList.propTypes = {
	type: PropTypes.string.isRequired,
	limit: PropTypes.number,
	keywords: PropTypes.array,
};
function getKeywordsByQuery(type, query, limit) {

	if (query.loading) {
		return [];
	}
	 return query.keywords.filter(x => 
		x.type === type &&
		x.count > 1).slice(0, limit);
}
const cont = createContainer((props) => {

	const { type, limit } = props;
	const skip = 0;
	const tenantId = Session.get('tenantId');
	let _limit = 100;

	if (limit) {
		_limit = limit;
	}
	if (tenantId) {
		props.keywordsQuery.refetch({
			tenantId: tenantId
		});
	}

	let keywords = [];
	switch (type) {
	case 'word':
		keywords = getKeywordsByQuery('word', props.keywordsQuery, _limit);
		break;
	case 'idea':
		keywords = getKeywordsByQuery('idea', props.keywordsQuery, _limit);
		break;
	default:
		break;
	}

	return {
		keywords,
		type,
	};
}, KeywordsList);

export default compose(keywordsQuery)(cont);
