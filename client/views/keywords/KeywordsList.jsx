KeywordsList = React.createClass({

	// This mixin makes the getMeteorData method keyword
	mixins: [ReactMeteorData],

	propTypes: {
		type: React.PropTypes.string.isRequired
	},

	// Loads items from the keywords collection and puts them on this.data.keywords
	getMeteorData() {
		const query = {
			type: this.props.type,
			count: {$gt: 0},
		};

		return {
			keywords: Keywords.find(query, {sort: {title: 1}}).fetch()
		};
	},

	renderKeywords() {

		return this.data.keywords.map((keyword, i) => {
			return <KeywordTeaser
							key={i}
							keyword={keyword} />;

		});

	},

	render() {

		 return (
			 <div className="keywords-list">
				 {this.renderKeywords()}

			 </div>


			);
		}


});
