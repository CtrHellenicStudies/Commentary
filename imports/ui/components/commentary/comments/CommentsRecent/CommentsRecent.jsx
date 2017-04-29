import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'react-slick';
import Comments from '/imports/collections/comments';

CommentsRecent = React.createClass({

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const handle = Meteor.subscribe('comments.recent', Session.get("tenantId"), 3);
		let recentComments = [];
		if (handle.ready()) {
			recentComments = Comments.find({}, {
				sort: {
					updated: -1,
				},
			}).fetch();
		}
		return {
			recentComments,
		};
	},

	render() {
		const settings = {
			dots: true,
			arrows: false,
			infinite: true,
			autoplay: true,
			speed: 300,
			autoplaySpeed: 10000,
			slidesToShow: 1,
			slidesToScroll: 1,
		};
		return (
			<section className="background-gray recent-comments">

				<div className="container">
					<div className="row">
						<div className="col-sm-8 col-sm-offset-2 text-center">
							<h3 className=" uppercase">
								Recently from the Commentary
							</h3>
							<i className="mdi mdi-format-quote quote-icon" />
							<Slider {...settings}>
								{this.data.recentComments.map((comment, index) => (
									<div
										key={index}
									>
										<p
											dangerouslySetInnerHTML={{
												__html: Utils.trunc(comment.revisions[comment.revisions.length - 1].text, 300),
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
									</div>
								))}
							</Slider>
						</div>
					</div>
				</div>

			</section>


		);
	},
});
