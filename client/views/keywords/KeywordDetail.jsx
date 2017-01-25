import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import KeywordContext from '/imports/ui/components/KeywordContext.jsx';
import RaisedButton from 'material-ui/RaisedButton';

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
		const keywordsSub = Meteor.subscribe('keywords.slug', this.props.slug, Session.get("tenantId"));

		// FETCH DATA:
		const query = {
			slug: this.props.slug,
		};
		const keyword = Keywords.findOne(query);

		return {
			keyword,
		};
	},

	deleteKeyword() {
		const keyword = this.data.keyword;
		Meteor.call('keywords.delete', keyword._id, (error, keywordId) => {
			if (error) {
				console.log(error);
			} else {
				FlowRouter.go('/keywords');
			}
		});
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
										{Roles.userIsInRole(Meteor.userId(), ['developer', 'admin', 'commenter']) ?
											<div>
												<RaisedButton
													href={`/keywords/${keyword.slug}/edit`}
													className="cover-link light"
													label="Edit"
												/>
												<RaisedButton
													onClick={this.deleteKeyword}
													className="cover-link light"
													label="Delete"
												/>
											</div>
										: ''}
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="page-content">
						{keyword.lineFrom ?
							<KeywordContext keyword={keyword} />
						: ''}
						{keyword.description && keyword.description.length ?
							<div className="keyword-description" dangerouslySetInnerHTML={{ __html: keyword.description }} />
						:
							<p className="no-description-available">
								No description available.
							</p>
						}
					</section>

					<CommentsRecent />

				</div>
			</div>
		);
	},

});
