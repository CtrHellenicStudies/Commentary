import { Session } from 'meteor/session';
import Keywords from '/imports/collections/keywords';

KeywordsList = React.createClass({

	propTypes: {
		type: React.PropTypes.string.isRequired,
		limit: React.PropTypes.number,
	},

	mixins: [ReactMeteorData],

	getMeteorData() {
		const type = this.props.type;
		const skip = 0;
		let limit = 100;
		if (this.props.limit) {
			limit = this.props.limit;
		}

		const query = {
			type,
			tenantId: Session.get("tenantId"),
			count: { $gte: 1 },
		};

		switch (type) {
			case 'word':
				Meteor.subscribe('keywords.keywords', query, skip, limit);
				break;
			case 'idea':
				Meteor.subscribe('keywords.keyideas', query, skip, limit);
				break;
		}

		const keywords = Keywords.find(query, {limit}).fetch();

		return {
			keywords,
		};
	},

	renderKeywords() {
		return this.data.keywords.map((keyword, i) => (
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
