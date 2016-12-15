KeywordsList = React.createClass({

	propTypes: {
		type: React.PropTypes.string.isRequired,
		limit: React.PropTypes.number,
	},

	// This mixin makes the getMeteorData method keyword
	mixins: [ReactMeteorData],

	// Loads items from the keywords collection and puts them on this.data.keywords
	getMeteorData() {

		let limit = 100;
		if (this.props.limit) {
			limit = this.props.limit;
		}

		switch (this.props.type) {
			case 'word':
				Meteor.subscribe('keywords.keywords', limit);
				break;
			case 'idea':
				Meteor.subscribe('keywords.keyideas', limit);
				break;
		}

		const query = {
			type: this.props.type,
			count: { $gte: 1 },
		};

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
