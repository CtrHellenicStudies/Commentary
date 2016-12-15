import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import KeywordContext from '/imports/ui/components/KeywordContext.jsx';

KeywordDetail = React.createClass({

	propTypes: {
		slug: React.PropTypes.string.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		// SUBSCRIPTIONS:
		const keywordsSub = Meteor.subscribe('keywords.slug', this.props.slug);

		// FETCH DATA:
		const query = {
			slug: this.props.slug,
		};
		const keyword = Keywords.findOne(query);

		return {
			keyword,
		};
	},

	render() {
		const keyword = this.data.keyword;

		if (!keyword) {
			return <div />;
		}
		return (
			<div className="page keywords-page keywords-detail-page">
				<div className="content primary">
					<section className="block header header-page cover parallax">
						<div className="background-image-holder blur-2--no-remove remove-blur blur-10">
							<img
								className="background-image"
								src="/images/apotheosis_homer.jpg"
								role="presentation"
							/>
						</div>
						<div className="block-screen brown" />

						<div className="container v-align-transform">
							<div className="grid inner">
								<div className="center-content">
									<div className="page-title-wrap">
										<h2 className="page-title ">{keyword.title}</h2>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						<KeywordContext keywordId={keyword._id} maxLines={3} />
						{
							keyword.description
						||
							<p className="no-description-available">
								No description available.
							</p>
						}
					</section>
				</div>
			</div>
		);
	},

});
