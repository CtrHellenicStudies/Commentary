import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommentsRecent = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const handle = Meteor.subscribe('comments.recent', 3);
		let recentComments = [];
		if (handle.ready()) {
			recentComments = Comments.find().fetch();
		}
		return {
			recentComments,
		};
	},

	render() {
		return (
			<section className="background-gray recent-comments">

				<div className="container">
					<div className="row">
						<div className="col-sm-8 col-sm-offset-2 text-center">
							<h3 className=" uppercase">
								Recently from the Commentary
							</h3>
							<i className="mdi mdi-format-quote quote-icon" />
							<div className="text-slider slider-arrow-controls">
								<ul className="slides">
									{this.data.recentComments.map((comment, index) => (
										<li
											key={index}
										>
											<p
												dangerouslySetInnerHTML={{
													__html: comment.revisions[comment.revisions.length - 1].text,
												}}
											/>
											<h4>
												-
												{comment.commenters.map((commenter) => (
													` ${commenter.name},`
												))}
												{` ${comment.work.title} ${
												comment.subwork.title}.${comment.lineFrom}-${
												comment.lineFrom + comment.nLines}`}
											</h4>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

			</section>


		);
	},
});
