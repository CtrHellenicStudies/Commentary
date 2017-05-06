import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'react-slick';
import Comments from '/imports/api/collections/comments';

// lib:
import muiTheme from '/imports/lib/muiTheme';

const CommentsRecent = React.createClass({

	propTypes: {
		comments: React.PropTypes.array,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	render() {
		const { comments } = this.props;
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
								{comments.map((comment, index) => (
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

export default createContainer(() => {
	const handle = Meteor.subscribe('comments.recent', Session.get('tenantId'), 3);
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
}, CommentsRecent);
